"use client";

import clsx from "clsx";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { MouseEventHandler, useEffect, useState } from "react";

const Pagination = ({ totalPages = 5 }: { totalPages: number }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const handlePageChange = (e: React.MouseEvent<HTMLElement>) => {
    const btnLabel = (e.target as HTMLButtonElement).ariaLabel;

    if (btnLabel === "Previous") {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } else if (btnLabel === "Next") {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", currentPage.toString());
    replace(`${pathname}?${params.toString()}`);
  }, [currentPage]);

  let pages = [];
  for (let page = 1; page <= totalPages; ++page) {
    pages.push(
      <button
        className={clsx(
          "relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase transition-all active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none hover:bg-gray-900/10 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white",
          currentPage === page
            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            : "text-gray-900 dark:text-white"
        )}
        type="button"
        key={"page-" + page}
        onClick={() => setCurrentPage(page)}
      >
        <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          {page}
        </span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4 mx-auto my-3">
      <button
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 dark:text-white uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
        aria-label="Previous"
        onClick={handlePageChange}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          aria-hidden="true"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          ></path>
        </svg>
        Previous
      </button>
      <div className="flex items-center gap-2">{pages}</div>
      <button
        className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 dark:text-white uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
        aria-label="Next"
        onClick={handlePageChange}
        disabled={currentPage === totalPages}
      >
        Next
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          aria-hidden="true"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
