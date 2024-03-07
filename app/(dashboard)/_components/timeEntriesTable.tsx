import { Row, ProjectProductMap, State, Period } from "@/app/_lib/definitions";
import { Product, TimeEntry } from "@/app/_lib/moneybird/definitions";
import { Project } from "@prisma/client";
import { projectsToMap } from "@/app/_lib/utils";
import { getSession } from "@/app/_lib/session";
import { db } from "@/app/_lib/db";
import { fetchData } from "@/app/_lib/moneybird/api";
import { createRows } from "@/app/(dashboard)/utils";
import Table from "./table";

const getProjects = async () => {
  const session = await getSession();
  if (session) {
    const user = session.user;
    return db.project.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  return [];
};

const TimeEntriesTable = async ({
  state,
  period,
  page = 1,
}: {
  state: State;
  period: Period;
  page?: number;
}) => {
  const [timeEntriesPromise, productsPromise] = await Promise.all([
    fetchData(
      `time_entries?page=${page}&per_page=20&filter=${encodeURIComponent(
        `state:${state === "billed" ? "all" : state},period:${period}`
      )}`
    ),
    fetchData("products"),
  ]);

  let [timeEntries, products, projects]: [TimeEntry[], Product[], Project[]] =
    await Promise.all([
      timeEntriesPromise.json(),
      productsPromise.json(),
      getProjects().catch(() => []),
    ]);

  if (state === "billed") {
    timeEntries = timeEntries.filter(
      (timeEntry) => timeEntry.billable && timeEntry.detail
    );
  }

  const projectProductMap: ProjectProductMap = projectsToMap(projects);

  const [rows, totalAmount, totalTime]: [Row[], number, number] = createRows(
    timeEntries,
    products,
    projectProductMap
  );

  return (
    <Table
      rows={rows}
      totalAmount={totalAmount}
      totalTime={totalTime}
      page={page}
      hasNextPage={!!timeEntriesPromise.headers.get("link")?.includes("next")}
    />
  );
};

export default TimeEntriesTable;
