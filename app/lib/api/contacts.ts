import { fetchAll } from "@/app/lib/api/data";

export const fetchAllContacts = async () => {
  return await fetchAll("contacts");
};
