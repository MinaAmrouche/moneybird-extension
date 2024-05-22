"use client";

import { TimeEntry } from "@/app/_lib/moneybird/definitions";
import Input from "@/app/_components/input";
import Checkbox from "@/app/_components/checkbox";
import Link from "next/link";
import { useState } from "react";
import moment from "moment";
import Alert from "@/app/_components/alert";
import { useForm, SubmitHandler } from "react-hook-form";

export type FormValues = {
  invoice: string;
  all: boolean;
  timeEntries: string[];
};

export default function CreateInvoiceForm({
  timeEntries,
  administrationId,
}: {
  timeEntries: TimeEntry[];
  administrationId?: string | undefined;
}) {
  const [status, setStatus] = useState("DEFAULT");
  const [invoiceId, setInvoiceId] = useState(null);

  const { handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      invoice: "",
      all: false,
      timeEntries: [],
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    const detailsAttributes = [
      {
        description: "Handover",
        time_entry_ids: Array.isArray(data.timeEntries)
          ? data.timeEntries
          : [data.timeEntries],
      },
    ];

    const body = {
      sales_invoice: {
        invoice_id: data.invoice,
        details_attributes: detailsAttributes,
      },
    };
    console.log(body);
    return;

    setStatus("LOADING");
    const res = await fetch(`/api/moneybird/invoices/${data.invoice}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const invoice = await res.json();
    if (invoice.error) {
      setStatus("ERROR");
    } else {
      setStatus("SUCCESS");
      setInvoiceId(invoice.id);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {status === "SUCCESS" && (
        <Alert type="success">
          <>
            <p>Your invoice was successfully updated!</p>
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
            Something went wrong during the update of your invoice. Please try
            again later.
          </p>
        </Alert>
      )}
      <div className="flex flex-col gap-6 mb-1">
        <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-gray-900">
          Choose a invoice
        </h6>
        <div className="relative h-11 w-full min-w-[200px]">
          <Input label="Invoice" name="invoice" register={register} required />
        </div>
        <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-gray-900">
          Select time entries
        </h6>
        <div className="flex flex-col">
          <Checkbox
            id="all"
            label="Select all"
            name="all"
            register={register}
          />

          {timeEntries.map(({ id, description, started_at, project }) => (
            <Checkbox
              key={id}
              id={id}
              name={`timeEntries`}
              label={`${description} - ${moment(started_at).format(
                "DD-MM-YYYY"
              )} - ${project.name}`}
              register={register}
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
