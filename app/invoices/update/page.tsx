import { revalidatePath } from "next/cache";
import { fetchData } from "@/app/_lib/moneybird/api";
import Subtitle from "@/app/_components/subtitle";
import UpdateInvoiceForm from "./_components/updateInvoiceForm";
import { TimeEntry } from "@/app/_lib/moneybird/definitions";
import { getSession } from "@/app/_lib/session";

export default async function CreateInvoicePage({}: {}) {
  const invoicesPromise = await fetchData(
    `sales_invoices?filter=period:this_year`
  );
  const invoices = await invoicesPromise.json();
  const session = await getSession();

  const onGetInvoice = async (invoiceId: string) => {
    "use server";

    const res = await fetchData(`sales_invoices/${invoiceId}`, "GET");
    const invoice = await res.json();
    let timeEntries: TimeEntry[] = [];
    if (invoice) {
      const timeEntriesPromise = await fetchData(
        `time_entries?filter=${encodeURIComponent(
          `state:open,contact_id:${invoice?.contact_id}`
        )}`
      );
      timeEntries = await timeEntriesPromise.json();
    }

    revalidatePath("/invoices/update");

    return [invoice, timeEntries];
  };

  const onUpdateInvoice = async (invoiceId: string, body: {}) => {
    "use server";

    const res = await fetchData(`sales_invoices/${invoiceId}`, "PATCH", body);
    const invoice = await res.json();
    revalidatePath("/invoices/update");
    return invoice;
  };

  return (
    <>
      <Subtitle>Update an existing invoice.</Subtitle>
      <UpdateInvoiceForm
        invoices={invoices}
        getInvoiceDetails={onGetInvoice}
        onSubmit={onUpdateInvoice}
        administrationId={session?.user?.administrationId}
      />
    </>
  );
}
