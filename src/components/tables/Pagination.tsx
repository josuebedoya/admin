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

  const handlePageSizeChange = (value: string | number) => {
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

  const classBtn =
    "inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm transition-colors duration-200 " +
    "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.05] " +
    "disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">

      {/* Selector de tamaño */}
      <SelectSize onChangeSelect={handlePageSizeChange} total={totalAmount} />

      {/* Navegación */}
      <div className="flex items-center gap-2">

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={classBtn}
          aria-label="Anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-1">
          {currentPage > 3 && (
            <span className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">...</span>
          )}
          {pagesAroundCurrent.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                ${currentPage === page
                  ? 'bg-brand-500 text-white shadow-sm ring-2 ring-brand-100 dark:ring-brand-900/30'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.05]'
                }`}
            >
              {page}
            </button>
          ))}
          {currentPage < totalPages - 2 && (
            <span className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">...</span>
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={classBtn}
          aria-label="Siguiente"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

      </div>
    </div>
  );
};

export default Pagination;
