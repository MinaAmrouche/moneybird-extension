import { Suspense } from "react";
import Spinner from "@/app/_components/spinner";
import Title from "@/app/_components/title";

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Title>Invoices</Title>
      <Suspense fallback={<Spinner />}>{children}</Suspense>
    </>
  );
}
