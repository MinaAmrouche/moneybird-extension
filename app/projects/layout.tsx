import { Suspense } from "react";
import Spinner from "@/app/_components/spinner";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col p-10 antialiased">
      <div className="px-4 sm:px-0 mb-4">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Projects to Products
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Link your projects to a product
        </p>
      </div>
      <Suspense fallback={<Spinner />}>{children}</Suspense>
    </main>
  );
}
