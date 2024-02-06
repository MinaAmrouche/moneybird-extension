import { fetchApiData } from "./data";

export const fetchTimeEntries = async (
  state: string = "open",
  period: string = "this_year"
) => {
  try {
    return await fetchApiData(
      `time_entries?filter=state%3A${state},period%3A${period}`
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
