"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { useEffect, useState } from "react";
import moment from "moment";
import Select from "@/app/_components/select";
import Checkbox from "@/app/_components/checkbox";
import Alert from "@/app/_components/alert";
import { ProjectProductMap } from "@/app/_lib/definitions";
import { Contact, TimeEntry } from "@/app/_lib/moneybird/definitions";
import { Project } from "@prisma/client";
import { formatTime, projectsToMap } from "@/app/_lib/utils";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export type FormValues = {
  contact: string;
  all: boolean;
  entries: Record<string, Record<string, boolean>>;
};

export default function CreateInvoiceForm({
  contacts,
  timeEntries,
  projects,
  administrationId,
  onSubmit,
}: {
  contacts: Contact[];
  timeEntries: TimeEntry[];
  projects: Project[];
  administrationId?: string | undefined;
  onSubmit: Function;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [status, setStatus] = useState("DEFAULT");
  const [invoiceId, setInvoiceId] = useState(null);
  const [projectProductMap, setProjectProductMap] = useState<ProjectProductMap>(
    {}
  );

  const { handleSubmit, register, setValue, getValues } = useForm<FormValues>({
    defaultValues: {
      contact: searchParams?.get("contact") || "",
      all: false,
      entries: {},
    },
  });

  useEffect(() => {
    setProjectProductMap(projectsToMap(projects));
  }, [projects]);

  const selectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allChecked = e.target.checked;
    const fields = getValues("entries");

    Object.entries(fields).forEach(([projectId, entries]) => {
      Object.entries(entries).forEach(([timeEntryId, checked]) => {
        if (checked !== allChecked) {
          setValue(`entries.${projectId}.${timeEntryId}`, allChecked);
        }
      });
    });
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setValue("all", false);
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const onFormSubmit: SubmitHandler<FormValues> = async (data) => {
    const detailsAttributes = Object.entries(data.entries).map(
      ([projectId, entries]) => {
        const selectedEntries = Object.keys(entries).filter(
          (key) => entries[key]
        );
        if (selectedEntries) {
          const attributes: {
            time_entry_ids: string[];
            amount?: string;
            product_id?: string;
            project_id: string;
            description?: string;
          } = {
            project_id: projectId,
            time_entry_ids: selectedEntries,
            amount: formatTime(
              timeEntries.reduce(
                (acc, { id, ended_at, started_at, paused_duration }) => {
                  if (selectedEntries.includes(id)) {
                    const time =
                      moment(ended_at).diff(
                        moment(started_at),
                        "seconds",
                        true
                      ) - paused_duration;
                    return acc + time;
                  }
                  return acc;
                },
                0
              )
            ),
          };
          if (projectProductMap[projectId]) {
            attributes.product_id = projectProductMap[projectId];
          }

          return attributes;
        }
      }
    );

    const body = {
      sales_invoice: {
        contact_id: data.contact,
        details_attributes: detailsAttributes.filter((el) => el),
      },
    };

    try {
      setStatus("LOADING");
      const invoice = await onSubmit(body);
      setStatus("SUCCESS");
      setInvoiceId(invoice.id);
    } catch (error) {
      setStatus("ERROR");
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
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
        <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal">
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
            register={register}
            handleChange={handleContactChange}
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
            handleChange={selectAllChange}
          />

          {timeEntries.map(({ id, description, started_at, project }) => (
            <Checkbox
              key={id}
              id={id}
              name={`entries.${project.id}.${id}`}
              label={`${description} - ${moment(started_at).format(
                "DD-MM-YYYY"
              )}`}
              register={register}
              handleChange={handleEntriesChange}
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
