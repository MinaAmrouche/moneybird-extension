import moment from "moment";
import { ProjectProductMap, Row } from "@/app/_lib/definitions";
import { Product, TimeEntry } from "@/app/_lib/moneybird/definitions";
import { formatTime } from "@/app/_lib/utils";

export const createRows = (
  timeEntries: TimeEntry[],
  products: Product[],
  projectProductMap: ProjectProductMap
): [Row[], number, number] => {
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
      const time = endedAt.diff(startedAt, "seconds", true) - paused_duration;
      const product = products.find(
        ({ id }) => id === projectProductMap[project?.id]
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

  return [rows, totalAmount, totalTime];
};
