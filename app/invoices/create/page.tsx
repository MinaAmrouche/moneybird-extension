import { Contact, TimeEntry } from "@/app/_lib/moneybird/definitions";
import { revalidatePath } from "next/cache";
import { getSession } from "@/app/_lib/session";
import CreateInvoiceForm from "@/app/invoices/create/_components/createInvoiceForm";
import { fetchData } from "@/app/_lib/moneybird/api";
import { db } from "@/app/_lib/db";
import { Project } from "@prisma/client";
import Subtitle from "@/app/_components/subtitle";

export default async function CreateInvoicePage({
  searchParams,
}: {
  searchParams?: {
    contact?: string;
  };
}) {
  const contact = searchParams?.contact || "";

  const session = await getSession();

  const projectsPromise = db.project.findMany({
    where: {
      userId: session?.user.id,
    },
  });

  const [timeEntriesPromise, contactsPromise] = await Promise.all([
    fetchData(
      `time_entries?filter=${encodeURIComponent(
        `state:open,contact_id:${contact}`
      )}`
    ),
    fetchData("contacts?per_page=100"),
  ]);

  let [timeEntries, contacts, projects]: [TimeEntry[], Contact[], Project[]] =
    await Promise.all([
      timeEntriesPromise.json(),
      contactsPromise.json(),
      projectsPromise,
    ]);

  const onCreateInvoice = async (body: {}) => {
    "use server";

    const res = await fetchData("sales_invoices", "POST", body);
    const invoice = await res.json();
    revalidatePath("/invoices/create");
    return invoice;
  };

  return (
    <>
      <Subtitle>Create a new invoice.</Subtitle>
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
