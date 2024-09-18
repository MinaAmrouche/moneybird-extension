"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import Select from "@/app/_components/select";
import Alert from "@/app/_components/alert";
import { Invoice, TimeEntry } from "@/app/_lib/moneybird/definitions";
import Checkbox from "@/app/_components/checkbox";
import moment from "moment";

export type FormValues = {
  invoice: string;
  detail: string;
  all: boolean;
  entries: string[];
};

export default function UpdateInvoiceForm({
  invoices,
  getInvoiceDetails,
  onSubmit,
  administrationId,
}: {
  invoices: Invoice[];
  getInvoiceDetails: Function;
  onSubmit: Function;
  administrationId?: string | undefined;
}) {
  const [status, setStatus] = useState("DEFAULT");
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);

  const { handleSubmit, register, setValue, getValues } = useForm<FormValues>();

  // const selectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const allChecked = e.target.checked;
  //   const fields = getValues("entries");

  //     fields.forEach((timeEntry) => {
  //       if (checked !== allChecked) {
  //         setValue(`entries.${timeEntryId}`, allChecked);
  //       }
  //     });
  // };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setValue("all", false);
    }
  };

  const onInvoiceSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const invoiceId = event.target.value;
    try {
      const [invoice, timeEntries] = await getInvoiceDetails(invoiceId);
      console.log(invoice);
      setInvoice(invoice);
      setTimeEntries(timeEntries);
    console.log(timeEntries);
    } catch (error) {
      console.error(`Failed to put objects: ${error}`);
    }
  };

  const onFormSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setStatus("LOADING");
      const body = {
        sales_invoice: {
          details_attributes: {
            id: data.detail,
            time_entry_ids: data.entries,
          },
        },
      };
      const invoice = await onSubmit(data.invoice, body);
      console.log(invoice);
      setInvoice(invoice);
      setStatus("SUCCESS");
    } catch (error) {
      console.error(`Failed to put objects: ${error}`);
      setStatus("ERROR");
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      {status === "SUCCESS" && <div>SUCCESS</div>}
      {status === "ERROR" && (
        <Alert type="error">
          <p>
            Something went wrong during the creation of your invoice. Please try
            again later.
          </p>
        </Alert>
      )}
      <div className="flex flex-col gap-6 mb-1">
        <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal">
          Choose an invoice
        </h6>
        <div className="relative h-11 w-full min-w-[200px]">
          <Select
            options={invoices.map(({ invoice_id, id }) => ({
              label: invoice_id,
              value: id,
            }))}
            label="Invoice"
            name="invoice"
            register={register}
            handleChange={onInvoiceSelect}
            required
          />
        </div>
        {invoice && (
          <>
            <span>{invoice.invoice_id}</span>
            <span>{invoice.contact.company_name}</span>
            <span>{moment(invoice.sent_at).format("DD-MM-YYYY")}</span>
            <a
              href={`https://moneybird.com/${administrationId}/sales_invoices/${invoice.id}`}
              target="_blank"
            >
              Go to my invoice
            </a>
            <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal">
              Choose a detail
            </h6>
            <div className="relative h-11 w-full min-w-[200px]">
              <Select
                options={invoice.details.map(({ id, description }) => ({
                  label: description,
                  value: id,
                }))}
                label="Detail"
                name="detail"
                register={register}
                required
              />
            </div>
            <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal">
              Select time entries
            </h6>
            <div className="flex flex-col">
              <Checkbox
                id="all"
                label="Select all"
                name="all"
                register={register}
                // handleChange={selectAllChange}
              />

              {timeEntries.map(({ id, description, started_at }) => (
                <Checkbox
                  key={id}
                  id={id}
                  name="entries"
                  label={`${description} - ${moment(started_at).format(
                    "DD-MM-YYYY"
                  )}`}
                  register={register}
                  handleChange={handleEntriesChange}
                />
              ))}
            </div>
          </>
        )}
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
          Update Invoice
        </button>
      </div>
    </form>
  );
}
