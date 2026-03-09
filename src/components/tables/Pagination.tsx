'use client';

import { dictionary } from "@/dictionary";
import SelectSize from "./selectSize";
import { useEffect, useState } from "react";

type PaginationProps = {
  currentPage: number;
  totalAmount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSize?: number;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalAmount,
  onPageChange,
  onPageSizeChange,
  pageSize = 10,
}) => {
  const [ sizePage, setSizePage ] = useState(pageSize);
  const [ totalPages, setTotalPages ] = useState(Math.ceil(totalAmount / sizePage) || 1);

  useEffect(() => {
    setSizePage(pageSize);
  }, [ pageSize ]);

  useEffect(() => {
    const newTotalPages = Math.ceil(totalAmount / sizePage) || 1;
    setTotalPages(newTotalPages);

    if (currentPage > newTotalPages) {
      onPageChange(newTotalPages);
    }
  }, [ totalAmount, sizePage, onPageChange, currentPage ]);

  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    setSizePage(newSize);
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  const numPagesToShow = Math.min(5, totalPages);
  const startPage = Math.max(1, Math.min(currentPage - 1, totalPages - numPagesToShow + 1));
  const pagesAroundCurrent = Array.from(
    { length: numPagesToShow },
    (_, i) => startPage + i
  );

  const classControls = "flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm mx-2";

  return (
    <div className="paginator flex items-center justify-center gap-4">
      <SelectSize onChangeSelect={handlePageSizeChange} />
      <div className="flex items-center ">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={classControls}
        >
          {dictionary.btn.previus}
        </button>
        <div className="flex items-center gap-2">
          {currentPage > 3 && <span className="px-2">...</span>}
          {pagesAroundCurrent.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded ${currentPage === page
                ? "bg-brand-500 text-white"
                : "text-gray-700 dark:text-gray-400"
                } flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500`}
            >
              {page}
            </button>
          ))}
          {currentPage < totalPages - 2 && <span className="px-2">...</span>}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={classControls}
        >
          {dictionary.btn.next}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
