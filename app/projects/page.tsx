import { Suspense } from "react";
import { revalidatePath } from "next/cache";
import { Product, Project } from "@/app/_lib/moneybird/definitions";
import { ProjectProductMap } from "@/app/_lib/definitions";
import { Project as PrismaProject } from "@prisma/client";
import ProjectsToProductForm from "@/app/projects/_components/projectsToProductsForm";
import { fetchData } from "@/app/_lib/moneybird/api";
import Spinner from "@/app/_components/spinner";
import { db } from "@/app/_lib/db";
import { getSession } from "@/app/_lib/session";

export default async function ProjectToProductPage() {
  const projectsPromise = fetchData("projects");
  const productsPromise = fetchData("products");
  const projectsToProductPromise = db.project.findMany({
    where: {
      userId: (await getSession())?.user.id,
    },
  });

  const [projects, products, projectsToProduct]: [
    Project[],
    Product[],
    PrismaProject[]
  ] = await Promise.all([
    projectsPromise,
    productsPromise,
    projectsToProductPromise,
  ]);

  const onSubmit = async (ppmap: ProjectProductMap[]) => {
    "use server";

    const session = await getSession();
    if (!session) {
      throw new Error("You must be logged in.");
    }
    const user = session.user;
    await db.$transaction(
      ppmap.map(({ projectId, productId }) =>
        db.project.upsert({
          where: { projectId },
          update: { productId, userId: user.id },
          create: { projectId, productId, userId: user.id },
        })
      )
    );
    revalidatePath("/projects");
  };

  return (
    <Suspense fallback={<Spinner />}>
      <ProjectsToProductForm
        projects={projects}
        products={products}
        projectsToProduct={projectsToProduct}
        onSubmit={onSubmit}
      />
    </Suspense>
  );
}
