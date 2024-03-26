"use server";

import Link from "next/link";
import LoginBtn from "@/app/_components/login-btn";
import { getSession } from "@/app/_lib/session";

const LINKS = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/invoices/create",
    label: "Create invoice",
  },
  {
    href: "/projects",
    label: "Projects to Products",
  },
];

export default async function Navbar() {
  const session = await getSession();
  const user = session?.user || null;

  return (
    <nav className="block fixed top-0 w-full h-16 z-10 px-10 py-3 mx-auto bg-white dark:bg-slate-950 text-gray-900 dark:text-white shadow-md bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="mr-4 block cursor-pointer py-1.5 font-sans text-base font-semibold leading-relaxed tracking-normal text-inherit antialiased"
        >
          Report
        </Link>
        <div>
          <ul className="flex flex-row items-center gap-6">
            {LINKS.map(({ href, label }) => (
              <li
                className="block p-1 font-sans text-sm antialiased font-medium leading-normal"
                key={label}
              >
                <Link
                  href={href}
                  className="flex items-center transition-colors hover:text-blue-500 dark:hover:text-blue-300"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="block p-1 font-sans text-sm antialiased font-medium leading-normal">
              <LoginBtn user={user} />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
