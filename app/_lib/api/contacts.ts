import { fetchAll } from "@/app/_lib/api/data";

export const fetchAllContacts = async () => {
  return await fetchAll("contacts");
};
