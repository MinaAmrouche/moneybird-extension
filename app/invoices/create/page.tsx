import { Contact, TimeEntry, User } from "@/app/_lib/definitions";
import { revalidatePath } from "next/cache";
import { getSession } from "@/app/_lib/session";
import CreateInvoiceForm from "@/app/invoices/create/_components/createInvoiceForm";
import { fetchData } from "@/app/_lib/api";

export default async function CreateInvoicePage() {
  const contacts: Contact[] = await fetchData("contacts");
  const timeEntries: TimeEntry[] = await fetchData(
    `time_entries?filter=${encodeURIComponent("state:open")}`
    );
    const session = await getSession();

  const onCreateInvoice = async () => {
    "use server";

    revalidatePath("/invoices/create");
  };

  return (
    <>
      <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
        Create a new invoice.
      </p>
      <CreateInvoiceForm
        contacts={contacts}
        timeEntries={timeEntries}
        onSubmit={onCreateInvoice}
        administrationId={(session?.user as User)?.administrationId}
      />
    </>
  );
}
