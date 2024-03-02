import { revalidatePath } from "next/cache";
import { Product, Project } from "@/app/_lib/definitions";
import ProjectsToProductForm from "@/app/projects/_components/projectsToProductsForm";
import { fetchData } from "@/app/_lib/api";

export default async function ProjectToProductPage() {
  const projects: Project[] = await fetchData("projects");
  const products: Product[] = await fetchData("products");

  const onSubmit = async () => {
    "use server";
    revalidatePath("/projects");
  };

  return (
    <ProjectsToProductForm
      projects={projects}
      products={products}
      onSubmit={onSubmit}
    />
  );
}
