import { fetchAll } from "@/app/lib/api/data";

export const fetchProjects = async () => {
  return fetchAll("projects");
};
