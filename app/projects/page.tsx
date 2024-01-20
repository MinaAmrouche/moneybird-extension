import { fetchProducts } from "@/app/lib/api/products";
import { fetchProjects } from "@/app/lib/api/projects";
import { Product, Project } from "@/app/lib/definitions";
import ProjectsToProductForm from "@/app/ui/projects/projectsToProductsForm";
import { revalidatePath } from "next/cache";

export default async function ProjectToProductPage() {
  const projects: Project[] = await fetchProjects();
  const products: Product[] = await fetchProducts();

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
