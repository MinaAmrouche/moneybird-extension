import { fetchAll } from "@/app/lib/api/data";

export const fetchProducts = async () => {
  return fetchAll("products");
};
