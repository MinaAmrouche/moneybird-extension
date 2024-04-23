import { Row, State, Period } from "@/app/_lib/definitions";
import { Product, TimeEntry } from "@/app/_lib/moneybird/definitions";
import { Project } from "@prisma/client";
import { formatTime } from "@/app/_lib/utils";
import {
  fetchProducts,
  fetchTimeEntries,
  getProjects,
  createRows,
  getTotalPages,
  getTotals,
} from "@/app/_core/dashboard/table";
import Pagination from "@/app/_components/pagination";
import clsx from "clsx";

const TimeEntriesTable = async ({
  state,
  period,
  page = 1,
  itemsPerPage = 20,
}: {
  state: State;
  period: Period;
  page?: number;
  itemsPerPage?: number;
}) => {
  let timeEntries: TimeEntry[] = [];
  let products: Product[] = [];
  let projects: Project[] = [];

  [timeEntries, products, projects] = await Promise.all([
    fetchTimeEntries(
      encodeURIComponent(
        `state:${state === "billed" ? "all" : state},period:${period}`
      )
    ),
    fetchProducts(),
    getProjects(),
  ]);

  if (state === "billed") {
    timeEntries = timeEntries.filter(
      (timeEntry) => timeEntry.billable && timeEntry.detail
    );
  }

  const totalPages = getTotalPages(itemsPerPage, timeEntries);

  const [totalAmount, totalTime] = getTotals(timeEntries, products, projects);

  const [rows, totalAmountOnPage, totalTimeOnPage]: [Row[], number, number] =
    createRows(
      timeEntries.slice((page - 1) * itemsPerPage, page * itemsPerPage),
      products,
      projects
    );

  return (
    <>
      <div className="flex border rounded-lg p-4 dark:p-0 bg-white dark:bg-slate-900 mt-4 sm:w-max md:w-full">
        <table className="table-auto w-full">
          <thead className="font-semibold uppercase text-slate-600 dark:text-slate-400 text-sm">
            <tr className="border-b-2">
              <td className="p-2">Date</td>
              <td className="p-2">Description</td>
              <td className="p-2">Project</td>
              <td className="p-2">Contact</td>
              <td className="p-2">State</td>
              <td className="p-2">Time</td>
              <td className="p-2">Amount</td>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b even:bg-blue-50/50 dark:even:bg-slate-800/50 dark:odd:bg-slate-800/50"
              >
                <td className="p-2">{row.date}</td>
                <td className="p-2">{row.description}</td>
                <td className="p-2">{row.project}</td>
                <td className="p-2">{row.contact}</td>
                <td className="p-2">
                  <div
                    className={clsx(
                      "relative grid select-none items-center whitespace-nowrap rounded-full py-1.5 px-3 w-fit font-sans text-xs font-bold uppercase",
                      {
                        "bg-cyan-500 dark:bg-transparent  dark:border dark:border-cyan-500 text-white dark:text-cyan-500":
                          row.state === "Open",
                        "bg-indigo-500 dark:bg-transparent dark:border dark:border-indigo-500 text-white dark:text-indigo-500":
                          row.state === "Billed",
                        "bg-gray-900 dark:bg-transparent dark:border dark:border-gray-300 text-white dark:text-gray-300":
                          row.state === "Non-billable",
                      }
                    )}
                  >
                    <span>{row.state}</span>
                  </div>
                </td>
                <td className="p-2">{row.time}</td>
                <td className="p-2">€{row.amount}</td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td className="p-2">
                <b>Total on page</b>
              </td>
              <td className="p-2">
                <b>{formatTime(totalTimeOnPage)}</b>
              </td>
              <td className="p-2">
                <b>€{totalAmountOnPage.toFixed(2)}</b>
              </td>
            </tr>
            <tr>
              <td></td>
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
      <Pagination totalPages={totalPages} />
    </>
  );
};

export default TimeEntriesTable;
