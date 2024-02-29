import clsx from "clsx";

export default function Alert({
  type,
  children,
}: {
  type: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "relative block w-full p-4 mb-4 text-base leading-5 text-white rounded-lg opacity-100 font-regular",
        {
          "bg-green-500": type === "success",
          "bg-red-500": type === "error",
          "bg-orange-500": type === "warning",
          "bg-blue-500": type === "info",
        }
      )}
    >
      {children}
    </div>
  );
}
