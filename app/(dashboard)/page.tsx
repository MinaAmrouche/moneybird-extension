import { Suspense } from "react";
import Filters from "@/app/(dashboard)/_components/filters";
import Spinner from "@/app/_components/spinner";
import TimeEntriesTable from "@/app/(dashboard)/_components/table";
import Title from "@/app/_components/title";
import Subtitle from "@/app/_components/subtitle";
import { Period, State } from "@/app/_lib/definitions";
import { fetchData } from "@/app/_lib/moneybird/api";
import { Contact } from "@/app/_lib/moneybird/definitions";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    state?: string;
    period?: string;
    page?: number;
    contact?: string;
  };
}) {
  const contactsPromise = await fetchData("contacts?per_page=100");

  let contacts: Contact[] = await contactsPromise.json();

  const state = searchParams?.state || "all";
  const period = searchParams?.period || "this_month";
  const page = searchParams?.page;
  const contact = searchParams?.contact || "";

  return (
    <>
      <Title>Report</Title>
      <Subtitle>Total hours and amount</Subtitle>
      <Filters
        state={state as State}
        period={period as Period}
        contact={contact}
        contacts={contacts}
      />
      <Suspense fallback={<Spinner />}>
        <TimeEntriesTable
          state={state as State}
          period={period as Period}
          contact={contact}
          page={Number(page)}
        />
      </Suspense>
    </>
  );
}
