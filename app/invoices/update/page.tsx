import { fetchData } from "@/app/_lib/moneybird/api";
import { TimeEntry } from "@/app/_lib/moneybird/definitions";
import { getSession } from "@/app/_lib/session";
import UpdateInvoiceForm from "@/app/invoices/update/_components/updateInvoiceForm";
import Subtitle from "@/app/_components/subtitle";

export default async function UpdateInvoicePage() {
  const timeEntries: TimeEntry[] = await fetchData(
    `time_entries?filter=${encodeURIComponent("state:open")}`
  );
  const session = await getSession();

  return (
    <>
      <Subtitle>Update an invoice.</Subtitle>
      <UpdateInvoiceForm
        timeEntries={timeEntries}
        administrationId={session?.user?.administrationId}
      />
    </>
  );
}
