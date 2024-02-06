import { PRODUCTS, PROJECT_PRODUCT_MAP } from "@/app/lib/constants";
import { fetchAllContacts } from "@/app/lib/api/contacts";
import { Contact, TimeEntry, User } from "@/app/lib/definitions";
import { createInvoice } from "@/app/lib/api/invoices";
import { fetchTimeEntries } from "@/app/lib/api/timeEntries";
import { formatTime } from "@/app/lib/utils";
import CreateInvoiceForm from "@/app/ui/invoices/createInvoiceForm";
import moment from "moment";
import { revalidatePath } from "next/cache";
import { getSession } from "@/app/lib/session";

export default async function CreateInvoicePage() {
  const contacts: Contact[] = await fetchAllContacts();
  const timeEntries: TimeEntry[] = await fetchTimeEntries("open", "this_year");
  const session = await getSession();

  const onCreateInvoice = async (contact: string, timeEntries: TimeEntry[]) => {
    "use server";
    try {
      const data = {
        sales_invoice: {
          contact_id: contact,
          details_attributes: Object.keys(PRODUCTS).map((id) => {
            let totalTime = 0;
            const entries = timeEntries
              .filter(({ project }) => PROJECT_PRODUCT_MAP[project.id] === id)
              .map(({ id, ended_at, started_at, paused_duration }) => {
                const time =
                  moment(ended_at).diff(moment(started_at), "seconds", true) -
                  paused_duration;
                totalTime += time;
                return id;
              });
            return {
              product_id: id,
              time_entry_ids: entries,
              amount: formatTime(totalTime),
            };
          }),
        },
      };

      const invoice = await createInvoice(data);
      revalidatePath("/invoices/create");
      return invoice;
    } catch (e) {
      console.error(e);
    }
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
