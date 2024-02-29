"use client";

import { Contact, TimeEntry } from "@/app/_lib/definitions";
import Select from "@/app/_components/select";
import Checkbox from "@/app/_components/checkbox";
import Link from "next/link";
import { FormEvent, useState } from "react";
import moment from "moment";
import Alert from "@/app/_components/alert";

export default function CreateInvoiceForm({
  contacts,
  timeEntries,
  onSubmit,
  administrationId,
}: {
  contacts: Contact[];
  timeEntries: TimeEntry[];
  onSubmit: Function;
  administrationId: string | undefined;
}) {
  const [entries, setEntries] = useState(
    Object.fromEntries(timeEntries.map(({ id }) => [id, false]))
  );
  const [selectAll, setSelectAll] = useState(false);
  const [status, setStatus] = useState("DEFAULT");
  const [invoiceId, setInvoiceId] = useState(null);

  const handleEntriesChange = (id: string, checked: boolean) => {
    setEntries((prevEntries) => {
      prevEntries[id] = checked;
      return { ...prevEntries };
    });

    if (!checked || selectAll) {
      setSelectAll(false);
    }
  };

  const selectAllChange = (id: string, checked: boolean) => {
    setSelectAll(checked);
    setEntries(Object.fromEntries(timeEntries.map(({ id }) => [id, checked])));
  };

  const onFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const contact = formData.get("contact");
    const selectedEntries = timeEntries.filter(({ id }) => entries[id]);
    setStatus("LOADING");
    const newInvoice = await onSubmit(contact, selectedEntries);
    if (newInvoice) {
      setStatus("SUCCESS");
      setInvoiceId(newInvoice.id);
    } else {
      setStatus("ERROR");
    }
  };

  return (
    <form onSubmit={onFormSubmit}>
      {status === "SUCCESS" && (
        <Alert type="success">
          <>
            <p>Your invoice was successfully created!</p>
            <a
              href={`https://moneybird.com/${administrationId}/sales_invoices/${invoiceId}`}
              target="_blank"
            >
              Go to my invoice
            </a>
          </>
        </Alert>
      )}
      {status === "ERROR" && (
        <Alert type="error">
          <p>
            Something went wrong during the creation of your invoice. Please try
            again later.
          </p>
        </Alert>
      )}
      <div className="flex flex-col gap-6 mb-1">
        <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-gray-900">
          Choose a contact
        </h6>
        <div className="relative h-11 w-full min-w-[200px]">
          <Select
            options={contacts.map(({ company_name, id }) => ({
              label: company_name,
              value: id,
            }))}
            label="Contact"
            name="contact"
          />
        </div>
        <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-gray-900">
          Select time entries
        </h6>
        <div className="flex flex-col">
          <Checkbox
            id="all"
            name="all"
            label="Select all"
            checked={selectAll}
            handleChange={selectAllChange}
          />

          {timeEntries.map(({ id, description, started_at }) => (
            <Checkbox
              key={id}
              id={id}
              name="timeEntries"
              label={`${description} - ${moment(started_at).format(
                "DD-MM-YYYY"
              )}`}
              handleChange={handleEntriesChange}
              checked={entries[id]}
            />
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <button
          className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg bg-blue-500 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-3"
          type="submit"
        >
          Create Invoice
        </button>
      </div>
    </form>
  );
}
