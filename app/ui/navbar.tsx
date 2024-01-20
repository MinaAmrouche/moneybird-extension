"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="block w-full px-6 py-3 mx-auto bg-white border shadow-md border-white/80 bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200">
      <div className="flex items-center justify-between text-gray-900">
        <Link
          href="/"
          className="mr-4 block cursor-pointer py-1.5 font-sans text-base font-semibold leading-relaxed tracking-normal text-inherit antialiased"
        >
          Report
        </Link>
        <div>
          <ul className="flex flex-row items-center gap-6">
            <li className="block p-1 font-sans text-sm antialiased font-medium leading-normal text-gray-900">
              <Link
                href="/invoices/create"
                className="flex items-center transition-colors hover:text-blue-500"
              >
                Create invoice
              </Link>
            </li>
            <li className="block p-1 font-sans text-sm antialiased font-medium leading-normal text-gray-900">
              <Link
                href="/projects"
                className="flex items-center transition-colors hover:text-blue-500"
              >
                Project to Product
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
