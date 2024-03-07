import { Suspense } from "react";
import Filters from "@/app/(dashboard)/_components/filters";
import Spinner from "@/app/_components/spinner";
import TimeEntriesTable from "@/app/(dashboard)/_components/timeEntriesTable";
import Title from "@/app/_components/title";
import Subtitle from "@/app/_components/subtitle";
import { Period, State } from "@/app/_lib/definitions";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    state?: string;
    period?: string;
    page?: number;
  };
}) {
  const state = searchParams?.state || "all";
  const period = searchParams?.period || "this_month";
  const page = searchParams?.page;

  return (
    <>
      <Title>Report</Title>
      <Subtitle>Total hours and amount</Subtitle>
      <Filters state={state as State} period={period as Period} />
      <Suspense fallback={<Spinner />}>
        <TimeEntriesTable
          state={state as State}
          period={period as Period}
          page={Number(page)}
        />
      </Suspense>
    </>
  );
}
