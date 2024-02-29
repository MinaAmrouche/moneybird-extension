"use client";

import { IProjectProductMap, Product, Project } from "@/app/_lib/definitions";
import { FormEvent, useMemo, useState } from "react";
import Select from "@/app/_components/select";
import { db } from "@/app/_lib/database/database.model";
import { useLiveQuery } from "dexie-react-hooks";
import Alert from "@/app/_components/alert";

export default function ProjectsToProductForm({
  projects,
  products,
  onSubmit,
}: {
  projects: Project[];
  products: Product[];
  onSubmit: Function;
}) {
  const [options] = useState(() => {
    const options = products.map(({ title, id }) => ({
      label: title,
      value: id,
    }));
    options.unshift({ label: "", value: "" });
    return options;
  });
  const [status, setStatus] = useState("DEFAULT");

  const projectsListQuery = useLiveQuery(() => db.projects.toArray());
  const projectsList = useMemo(
    () =>
      projectsListQuery?.reduce<Record<string, string>>(
        (obj, { projectId, productId }) => ((obj[projectId] = productId), obj),
        {}
      ),
    [projectsListQuery]
  );

  const mapProjectsToProducts = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data: IProjectProductMap[] = [];

    projects.forEach(({ id }) => {
      const productId = formData.get(id)?.toString();
      if (productId) {
        data.push({
          productId,
          projectId: id,
        });
      }
    });

    try {
      await db.projects.bulkPut(data);
      setStatus("SUCCESS");
    } catch (error) {
      console.error(`Failed to put objects: ${error}`);
      setStatus("ERROR");
    }

    await onSubmit();
  };

  return (
    <form onSubmit={mapProjectsToProducts} className="flex flex-col gap-4">
      {status === "SUCCESS" && (
        <Alert type="success">
          <p>Saved!</p>
        </Alert>
      )}
      {status === "ERROR" && (
        <Alert type="error">
          <p>Something went wrong. Please try again later.</p>
        </Alert>
      )}
      {projectsList &&
        projects.map(({ name, id }) => {
          return (
            <Select
              label={name}
              name={id}
              options={options}
              key={id}
              defaultValue={projectsList[id]}
            />
          );
        })}
      <button
        type="submit"
        className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg bg-blue-500 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-3"
      >
        Save
      </button>
    </form>
  );
}
