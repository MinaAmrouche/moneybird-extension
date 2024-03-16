"use server";

import moment from "moment";
import { db } from "@/app/_lib/db";
import { fetchData } from "@/app/_lib/moneybird/api";
import { Product, TimeEntry } from "@/app/_lib/moneybird/definitions";
import { getSession } from "@/app/_lib/session";
import { formatTime, projectsToMap } from "@/app/_lib/utils";
import { ProjectProductMap, Row } from "@/app/_lib/definitions";
import { Project } from "@prisma/client";

export const fetchTimeEntries = async (
  filter = "state:open,period:this_month"
) => {
  const perPage = 100;
  try {
    // Load 200 entries at a time
    const timeEntriesPromise = await Promise.all([
      fetchData(`time_entries?page=1&per_page=${perPage}&filter=${filter}`),
      fetchData(`time_entries?page=2&per_page=${perPage}&filter=${filter}`),
    ]);

    let timeEntriesList: TimeEntry[][] = await Promise.all(
      timeEntriesPromise.map((r) => r.json())
    );

    // If there are more entries to be loaded
    if (timeEntriesPromise[1]?.headers.get("link")?.includes("next")) {
      // Loop until we reach the last page, 200 at a time
      for (let page = 2; true; page += 2) {
        const timeEntriesPromise = await Promise.all([
          fetchData(
            `time_entries?page=${page}&per_page=${perPage}&filter=${filter}`
          ),
          fetchData(
            `time_entries?page=${page + 1}&per_page=${perPage}&filter=${filter}`
          ),
        ]);

        const list: TimeEntry[][] = await Promise.all(
          timeEntriesPromise.map((r) => r.json())
        );
        timeEntriesList = timeEntriesList.concat(list);

        // If there are no more pages, break
        if (!timeEntriesPromise[1]?.headers.get("link")?.includes("next")) {
          break;
        }
      }
    }
    const timeEntries: TimeEntry[] = [];
    return timeEntries.concat(...timeEntriesList);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchProducts = async () => {
  try {
    const productsPromise = await fetchData("products");
    const products: Product[] = await productsPromise.json();
    return products;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getProjects = async () => {
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

export const getTotalPages = (
  itemsPerPage: number,
  timeEntries: TimeEntry[]
) => {
  return Math.ceil(timeEntries.length / itemsPerPage);
};

export const createRows = (
  timeEntries: TimeEntry[],
  products: Product[],
  projects: Project[]
): [Row[], number, number] => {
  let totalAmount = 0;
  let totalTime = 0;
  const projectProductMap: ProjectProductMap = projectsToMap(projects);

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

export const getTotalAmount = (
  timeEntries: TimeEntry[],
  products: Product[],
  projects: Project[]
) => {
  const projectProductMap: ProjectProductMap = projectsToMap(projects);

  return timeEntries.reduce((accumulator, currentTimeEntry) => {
    const { billable, started_at, ended_at, paused_duration, project_id } =
      currentTimeEntry;
    const startedAt = moment(started_at);
    const endedAt = moment(ended_at);
    const time = endedAt.diff(startedAt, "seconds", true) - paused_duration;
    const product = products.find(
      ({ id }) => id === projectProductMap[project_id]
    );

    let amount = 0;
    if (billable && product) {
      amount = time * (product.price / 3600);
    }
    return accumulator + amount;
  }, 0);
};

export const getTotals = (
  timeEntries: TimeEntry[],
  products: Product[],
  projects: Project[]
) => {
  const projectProductMap: ProjectProductMap = projectsToMap(projects);

  return timeEntries.reduce(
    (accumulator, currentTimeEntry) => {
      const { billable, started_at, ended_at, paused_duration, project_id } =
        currentTimeEntry;
      const startedAt = moment(started_at);
      const endedAt = moment(ended_at);
      const time = endedAt.diff(startedAt, "seconds", true) - paused_duration;
      const product = products.find(
        ({ id }) => id === projectProductMap[project_id]
      );

      let amount = 0;
      if (billable && product) {
        amount = time * (product.price / 3600);
      }
      return [accumulator[0] + amount, accumulator[1] + time];
    },
    [0, 0]
  );
};
