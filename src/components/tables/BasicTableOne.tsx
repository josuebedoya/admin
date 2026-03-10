"use client";

import {Table, TableBody, TableCell, TableHeader, TableRow} from "../ui/table";
import Pagination from "./Pagination";
import Button from "@/components/ui/button/Button";
import SearchEngine from "@/components/common/searchEngine";

type TableProps = {
  data: {
    headers: string[];
    body: {
      row: any[];
    }[];
  };
  pagination?: {
    currentPage: number;
    totalAmount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSize?: number;
  };
  stickyLastRow?: boolean;
  sortable?: {
    columnKeys: string[]; // Nombres de columnas reales para ordenar (ej: ['id', 'name', 'category', 'shelf'])
    onSort: (column: string) => void;
    sortBy: string | null;
    sortOrder: 'asc' | 'desc';
  };
  buttonAdd?: {
    onClick: () => void;
    label: string;
  };
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string
  }
};

export default function BasicTableOne({data, stickyLastRow, pagination, sortable, buttonAdd, search}: TableProps) {

  const getSortIcon = (columnKey: string) => {
    if (!sortable || sortable.sortBy !== columnKey) {
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
        </svg>
      );
    }
    if (sortable.sortOrder === 'asc') {
      return (
        <svg className="w-3.5 h-3.5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7"/>
        </svg>
      );
    }
    return (
      <svg className="w-3.5 h-3.5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-0">
      {/* ── Controls ── */}
      {buttonAdd && (
        <div className="flex justify-end gap-4 mb-4 lg:px-6">
          {search && <SearchEngine value={search.value} onChange={search.onChange} placeholder={search.placeholder}/>}
          <Button
            size='sm'
            variant='primary'
            onClick={buttonAdd.onClick}
          >
            + {' ' + buttonAdd.label}
          </Button>
        </div>
      )}
      {/* ── Tabla ── */}
      <div className=" rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-full overflow-x-auto rounded-xl">
          <div className="min-w-full xl:min-w-[1102px] overflow-y-auto max-h-[60vh] lg:max-h-[70vh] scrollbar-primary">
            <Table>
              {/* Header */}
              <TableHeader>
                <TableRow
                  className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/[0.05]">
                  {data?.headers?.map((h, i) => {
                    const columnKey = sortable?.columnKeys?.[i];
                    const isSortable = sortable && columnKey && columnKey !== '';
                    return (
                      <TableCell
                        key={i}
                        isHeader
                        className="px-3 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap sticky top-0 z-10 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm select-none"
                      >
                        <div
                          className={`flex items-center gap-2 ${isSortable ? 'cursor-pointer group' : ''}`}
                          onClick={() => isSortable && sortable.onSort(columnKey)}
                        >
                          <span
                            className="group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-200">{h}</span>
                          {isSortable && (
                            <span
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-brand-500">
                              {getSortIcon(columnKey)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHeader>

              {/* Body */}
              <TableBody>
                {data?.body?.map((b, i) => {
                  const isLastRow = i === data.body.length - 1;
                  return (
                    <TableRow
                      key={i}
                      className={`group transition-colors duration-150 border-b border-gray-100 dark:border-white/[0.02] last:border-b-0
                        ${isLastRow && stickyLastRow
                        ? 'sticky bottom-0 z-10 bg-gray-50 dark:bg-gray-800 font-medium'
                        : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                      }`}
                    >
                      {b?.row?.map((c: any, j: number) => (
                        <TableCell
                          key={j}
                          className={`px-3 py-3 text-sm whitespace-nowrap text-start
                            ${isLastRow && stickyLastRow
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {c}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* ── Paginador ── */}
        {(pagination?.totalAmount || 0) > 1 && (
          <div
            className="px-6 py-4 border border-gray-200  rounded-xl m-4 dark:border-white/[0.05] bg-white dark:bg-gray-900">
            <Pagination
              currentPage={pagination?.currentPage || 1}
              totalAmount={pagination?.totalAmount || 0}
              onPageChange={pagination?.onPageChange || (() => {
              })}
              onPageSizeChange={pagination?.onPageSizeChange}
              pageSize={pagination?.pageSize}
            />
          </div>
        )}
      </div>
    </div>
  );
}
