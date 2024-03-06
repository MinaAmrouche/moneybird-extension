import { Contact, TimeEntry } from "@/app/_lib/moneybird/definitions";
import { revalidatePath } from "next/cache";
import { getSession } from "@/app/_lib/session";
import CreateInvoiceForm from "@/app/invoices/create/_components/createInvoiceForm";
import { fetchData } from "@/app/_lib/moneybird/api";
import { db } from "@/app/_lib/db";
import { Project } from "@prisma/client";

export default async function CreateInvoicePage() {
  const session = await getSession();

  const timeEntriesPromise = fetchData(
    `time_entries?filter=${encodeURIComponent("state:open")}`
  );
  const contactsPromise = fetchData("contacts");
  const projectsPromise = db.project.findMany({
    where: {
      userId: session?.user.id,
    },
  });

  const [timeEntries, contacts, projects]: [TimeEntry[], Contact[], Project[]] =
    await Promise.all([timeEntriesPromise, contactsPromise, projectsPromise]);

  const onCreateInvoice = async (body: {}) => {
    "use server";

    const invoice = await fetchData("sales_invoices", "POST", body);
    revalidatePath("/invoices/create");
    return invoice;
  };

  return (
    <>
      <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
        Create a new invoice.
      </p>
      <CreateInvoiceForm
        contacts={contacts}
        timeEntries={timeEntries}
        projects={projects}
        onSubmit={onCreateInvoice}
        administrationId={session?.user?.administrationId}
      />
    </>
  );
}
