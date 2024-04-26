"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Select from "@/app/_components/select";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { PERIODS, Period, STATES, State } from "@/app/_lib/definitions.d";
import { Contact } from "@/app/_lib/moneybird/definitions";

export type FormValues = {
  state: State;
  period: Period;
  contact?: string;
};

const capitalizeString = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const STATES_OPTIONS: Array<{ value: State; label: string }> = STATES.map(
  (state) => {
    const label = state.replace("_", "-");
    return {
      value: state,
      label: capitalizeString(label),
    };
  }
);

const PERIODS_OPTIONS: Array<{ value: Period; label: string }> = PERIODS.map(
  (period) => {
    const label = period.replace("_", " ");
    return {
      value: period,
      label: capitalizeString(label),
    };
  }
);

export default function Filters({
  state,
  period,
  contact,
  contacts,
}: {
  state?: State;
  period?: Period;
  contact?: string;
  contacts: Contact[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const form = useForm<FormValues>({
    defaultValues: {
      state: state ?? "all",
      period: period ?? "this_month",
      contact: contact ?? "",
    },
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-between align-center gap-4">
      <div className="flex gap-4">
        <Select
          options={STATES_OPTIONS}
          label="State"
          name="state"
          register={form.register}
          handleChange={handleFilterChange}
        />
        <Select
          options={PERIODS_OPTIONS}
          label="Period"
          name="period"
          register={form.register}
          handleChange={handleFilterChange}
        />
        <Select
          options={contacts.map((contact) => ({
            value: contact.id,
            label: contact.company_name,
          }))}
          label="Contact"
          name="contact"
          register={form.register}
          handleChange={handleFilterChange}
        />
      </div>
      <Link
        href="/invoices/create"
        className="align-middle select-none text-nowrap font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg bg-blue-500 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Create invoice
      </Link>
    </div>
  );
}
