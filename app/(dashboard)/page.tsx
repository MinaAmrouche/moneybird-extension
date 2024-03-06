import { Suspense } from "react";
import Filters from "@/app/(dashboard)/_components/filters";
import Spinner from "@/app/_components/spinner";
import TimeEntriesTable from "@/app/(dashboard)/_components/table";
import Title from "@/app/_components/title";
import Subtitle from "@/app/_components/subtitle";

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

  return (
    <>
      <Title>Report</Title>
      <Subtitle>Total hours and amount</Subtitle>
      <Filters state={state} period={period} />
      <Suspense fallback={<Spinner />}>
        <TimeEntriesTable state={state} period={period} />
      </Suspense>
    </>
  );
}
