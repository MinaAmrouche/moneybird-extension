import { Suspense } from "react";
import Spinner from "@/app/_components/spinner";
import Title from "@/app/_components/title";
import Subtitle from "@/app/_components/subtitle";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Title>Projects to Products</Title>
      <Subtitle>Link your projects to a product</Subtitle>
      <Suspense fallback={<Spinner />}>{children}</Suspense>
    </>
  );
}
