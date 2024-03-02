import Table from "@/app/(dashboard)/_components/table";
import Filters from "@/app/(dashboard)/_components/filters";
import { TimeEntry } from "@/app/_lib/definitions";
import { fetchData } from "@/app/_lib/api";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    state?: string;
    period?: string;
  };
}) {
  const state = searchParams?.state || "all";
  const period = searchParams?.period || "this_month";

  const timeEntries: TimeEntry[] = await fetchData(
    `time_entries?filter=${encodeURIComponent(
      `state:${state},period:${period}`
    )}`
  );

  return (
    <main className="flex min-h-screen flex-col p-10 antialiased">
      <div className="px-4 sm:px-0 mb-4">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Report
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Total hours and amount
        </p>
      </div>
      <Filters />
      <Table timeEntries={timeEntries} />
    </main>
  );
}
