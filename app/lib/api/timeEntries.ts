import { unstable_noStore as noStore } from "next/cache";

export const fetchTimeEntries = async (
  state: string = "open",
  period: string = "this_year"
) => {
  noStore();

  const res = await fetch(
    `${process.env.API_URL}/${process.env.ADMINISTRATION_ID}/time_entries?filter=state%3A${state},period%3A${period}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
