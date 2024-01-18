import { unstable_noStore as noStore } from "next/cache";

export const fetchContacts = async () => {
  noStore();

  const res = await fetch(
    `${process.env.API_URL}/${process.env.ADMINISTRATION_ID}/contacts`,
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
