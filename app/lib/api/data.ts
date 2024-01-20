import { unstable_noStore } from "next/cache";

export const fetchAll = async (resource: string) => {
  unstable_noStore();

  const res = await fetch(
    `${process.env.API_URL}/${process.env.ADMINISTRATION_ID}/${resource}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch " + resource);
  }

  return res.json();
};
