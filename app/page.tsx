import { RATES } from "./lib/constants";
import { fetchTimeEntries } from "./lib/data";
import { formatTime } from "./lib/utils";
import moment from "moment/moment";

interface TimeEntryInterface {
  id: string;
  started_at: string;
  ended_at: string;
  paused_duration: number;
  billable: boolean;
  description: string;
  contact: {
    company_name: string;
  };
  project: {
    id: string;
    name: string;
  };
}

interface RowInterface {
  id: string;
  date: string;
  description: string;
  time: string;
  project: string;
  contact: string;
  amount: string;
}

export default async function Home() {
  const timeEntries: TimeEntryInterface[] = await fetchTimeEntries();
  let totalTime = 0;
  let totalAmount = 0;

  const rows: RowInterface[] = timeEntries.map(
    ({
      id,
      started_at,
      ended_at,
      description,
      contact,
      project,
      paused_duration,
    }) => {
      const startedAt = moment(started_at);
      const endedAt = moment(ended_at);
      const time = endedAt.diff(startedAt, "seconds", true) - paused_duration;
      const amount = time * (RATES[project.id] / 3600);

      totalTime += time;
      totalAmount += amount;

      return {
        id,
        date: startedAt.format("DD-MM-YYYY"),
        description,
        time: formatTime(time),
        project: project.name,
        contact: contact.company_name,
        amount: amount.toFixed(2),
      };
    }
  );

  return (
    <main className="flex min-h-screen flex-col p-10 antialiased">
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Report
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Total hours and amount
        </p>
      </div>
      <div className="flex border rounded-lg p-4 bg-white mt-4">
        <table className="table-auto w-full">
          <thead className="font-semibold uppercase text-slate-600 text-sm">
            <tr className="border-b-2">
              <td className="p-2">Date</td>
              <td className="p-2">Description</td>
              <td className="p-2">Project</td>
              <td className="p-2">Contact</td>
              <td className="p-2">Time</td>
              <td className="p-2">Amount</td>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="p-2">{row.date}</td>
                <td className="p-2">{row.description}</td>
                <td className="p-2">{row.project}</td>
                <td className="p-2">{row.contact}</td>
                <td className="p-2">{row.time}</td>
                <td className="p-2">€{row.amount}</td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td className="p-2">
                <b>Total</b>
              </td>
              <td className="p-2">
                <b>{formatTime(totalTime)}</b>
              </td>
              <td className="p-2">
                <b>€{totalAmount.toFixed(2)}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
