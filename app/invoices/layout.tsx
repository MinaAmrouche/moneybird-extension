export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col p-10 antialiased">
      <div className="px-4 sm:px-0 mb-4">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Invoices
        </h3>
      </div>
      {children}
    </main>
  );
}
