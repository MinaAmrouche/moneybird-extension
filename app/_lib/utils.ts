import { Project } from "@prisma/client";
import { ProjectProductMap } from "./definitions";

export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  return `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
};

export const projectsToMap = (projects: Project[]) => {
  return (
    projects?.reduce<ProjectProductMap>(
      (obj, { projectId, productId }) => ((obj[projectId] = productId), obj),
      {}
    ) || {}
  );
};
