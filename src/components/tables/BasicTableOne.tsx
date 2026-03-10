'use client';

import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../ui/table";
import Pagination from "./Pagination";

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
};

export default function BasicTableOne({ data, stickyLastRow, pagination, sortable }: TableProps) {
  
  const getSortIcon = (columnKey: string) => {
    if (!sortable || sortable.sortBy !== columnKey) {
      return (
        <svg className="w-5 h-5 ml-1 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortable.sortOrder === 'asc') {
      return (
        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };

  return (
    <div className="section-table">
      <div
        className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-full xl:min-w-[1102px] overflow-y-auto max-h-[65vh] lg:max-h-[92vh] scrollbar-primary">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow className="rounded-lg overflow-hidden bg-brand-500  rounded-tr-lg rounded-tl-lg">
                  {data?.headers?.map((h, i) => {
                    const columnKey = sortable?.columnKeys?.[i];
                    const isSortable = sortable && columnKey && columnKey !== '';
                    
                    return (
                      <TableCell
                        key={i}
                        isHeader
                        className="px-5 py-5 font-medium text-brand-600 text-start text-theme-xs sticky top-0 z-10 bg-brand-100 hover:bg-brand-200 transition-colors duration-200 cursor-pointer select-none"
                      >
                        <div 
                          className={`flex items-center justify-between ${
                            isSortable ? 'cursor-pointer hover:opacity-70 transition-opacity select-none' : ''
                          }`}
                          onClick={() => isSortable && sortable.onSort(columnKey)}
                        >
                          <span>{h}</span>
                          {isSortable && getSortIcon(columnKey)}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {data?.body?.map((b, i) => (
                  <TableRow key={i} className='hover:bg-gray-100 duration-150 transition-all'>
                    {b?.row?.map((c: any, j: number) => {
                      const isLastRow = i === data.body.length - 1;
                      return (
                        <TableCell className={`px-3 py-3 sm:px-6 text-start cursor-pointer ${isLastRow && stickyLastRow ? 'sticky bottom-0 z-10 bg-brand-50 !text-gray-dark' : ''}`} key={j}>
                          {c}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        {
          (pagination?.totalAmount || 1) > 1 && (
            <Pagination
              currentPage={pagination?.currentPage || 1}
              totalAmount={pagination?.totalAmount || 0}
              onPageChange={pagination?.onPageChange || (() => { })}
              onPageSizeChange={pagination?.onPageSizeChange}
              pageSize={pagination?.pageSize}
            />
          )
        }
      </div>
    </div>
  );
}
