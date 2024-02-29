import { fetchAll } from "@/app/_lib/api/data";

export const fetchProjects = async () => {
  return await fetchAll("projects");
};
