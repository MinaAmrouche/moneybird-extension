"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ProjectProductMap } from "@/app/_lib/definitions";
import { Product, Project } from "@/app/_lib/moneybird/definitions";
import { Project as PrismaProject } from "@prisma/client";
import Select from "@/app/_components/select";
import Alert from "@/app/_components/alert";
import { projectsToMap } from "@/app/_lib/utils";

export type FormValues = {
  projects: Record<string, string>;
};

export default function ProjectsToProductForm({
  projects,
  products,
  projectsToProduct,
  onSubmit,
}: {
  projects: Project[];
  products: Product[];
  projectsToProduct: PrismaProject[];
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
  const { handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      projects: projectsToMap(projectsToProduct),
    },
  });

  const mapProjectsToProducts: SubmitHandler<FormValues> = async (data) => {
    const ppmap: ProjectProductMap[] = [];

    Object.entries(data.projects).forEach(([projectId, productId]) => {
      if (productId) {
        ppmap.push({ projectId, productId });
      }
    });

    try {
      setStatus("LOADING");
      await onSubmit(ppmap);
      setStatus("SUCCESS");
    } catch (error) {
      console.error(`Failed to put objects: ${error}`);
      setStatus("ERROR");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(mapProjectsToProducts)}
      className="flex flex-col gap-4"
    >
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
      {projects.map(({ name, id }) => {
        return (
          <Select
            label={name}
            name={`projects.${id}`}
            options={options}
            key={id}
            register={register}
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
