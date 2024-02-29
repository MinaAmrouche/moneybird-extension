import { fetchAll } from "@/app/_lib/api/data";

export const fetchProducts = async () => {
  return await fetchAll("products");
};
