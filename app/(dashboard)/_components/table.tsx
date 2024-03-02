"use client";

import {
  IProjectProductMap,
  Product,
  Row,
  TimeEntry,
} from "@/app/_lib/definitions";
import { formatTime } from "@/app/_lib/utils";
import moment from "moment/moment";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function TimeEntriesTable({
  timeEntries,
  products,
}: {
  timeEntries: TimeEntry[];
  products: Product[];
}) {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [projects, setProjects] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((query: IProjectProductMap[]) => {
        const projects = query?.reduce<Record<string, string>>(
          (obj, { projectId, productId }) => (
            (obj[projectId] = productId), obj
          ),
          {}
        );

        setProjects(projects);
      });
  }, []);

  useEffect(() => {
    setRows(() => {
      let totalAmount = 0;
      let totalTime = 0;

      const rows: Row[] = timeEntries.map(
        ({
          id,
          started_at,
          ended_at,
          description,
          contact,
          project,
          paused_duration,
          billable,
          detail,
        }) => {
          const startedAt = moment(started_at);
          const endedAt = moment(ended_at);
          const time =
            endedAt.diff(startedAt, "seconds", true) - paused_duration;
          const product = products.find(
            ({ id }) => id === projects[project?.id]
          );
          let amount = 0;
          if (billable && product) {
            amount = time * (product.price / 3600);
          }

          totalAmount += amount;
          totalTime += time;

          return {
            id,
            date: startedAt.format("DD-MM-YYYY"),
            description,
            time: formatTime(time),
            project: project?.name,
            state: billable ? (detail ? "Billed" : "Open") : "Non-billable",
            contact: contact?.company_name,
            amount: amount.toFixed(2),
          };
        }
      );

      setTotalAmount(totalAmount);
      setTotalTime(totalTime);

      return rows;
    });
  }, [projects, timeEntries, products]);

  return (
    <div className="flex border rounded-lg p-4 bg-white mt-4">
      <table className="table-auto w-full">
        <thead className="font-semibold uppercase text-slate-600 text-sm">
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
            <tr key={row.id} className="border-b even:bg-blue-50/50">
              <td className="p-2">{row.date}</td>
              <td className="p-2">{row.description}</td>
              <td className="p-2">{row.project}</td>
              <td className="p-2">{row.contact}</td>
              <td className="p-2">
                <div
                  className={clsx(
                    "relative grid select-none items-center whitespace-nowrap rounded-full py-1.5 px-3 w-fit font-sans text-xs font-bold uppercase",
                    {
                      "bg-cyan-500 text-white": row.state === "Open",
                      "bg-indigo-500 text-white": row.state === "Billed",
                      "bg-gray-900/10 text-gray-900":
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
  );
}
