"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Select from "./select";
import Link from "next/link";

const STATES = [
  { value: "all", label: "All" },
  { value: "non_billable", label: "Non-billable" },
  { value: "open", label: "Open" },
];

const PERIODS = [
  { value: "this_month", label: "This month" },
  { value: "prev_month", label: "Previous month" },
  { value: "next_month", label: "Next month" },
  { value: "this_quarter", label: "This quarter" },
  { value: "prev_quarter", label: "Previous quarter" },
  { value: "next_quarter", label: "Next quarter" },
  { value: "this_year", label: "This year" },
  { value: "prev_year", label: "Previous year" },
  { value: "next_year", label: "Next year" },
];

export default function Filters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-between align-center">
      <div className="flex gap-4">
        <Select
          defaultValue={searchParams.get("state")?.toString()}
          options={STATES}
          handleChange={handleFilterChange}
          label="State"
          name="state"
        />
        <Select
          defaultValue={searchParams.get("period")?.toString()}
          options={PERIODS}
          handleChange={handleFilterChange}
          label="Period"
          name="period"
        />
      </div>
      <Link
        href="/invoices/create"
        className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg bg-blue-500 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-3"
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
