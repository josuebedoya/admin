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
        <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortable.sortOrder === 'asc') {
      return (
        <svg className="w-4 h-4 opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };

  const itemsTEst = {
    headers: ['ID', 'NOMBRE', 'CATEGORÍA', 'ESTANTERÍA', 'CANTIDAD', 'PRECIO', 'ESTADO'],
    body: [
      { row: ['1', 'Producto 1', 'Categoría A', 'Estantería X', '10', '$100', 'Activo'] },
      { row: ['2', 'Producto 2', 'Categoría B', 'Estantería Y', '5', '$50', 'Inactivo'] },
      { row: ['3', 'Producto 3', 'Categoría A', 'Estantería Z', '20', '$200', 'Activo'] },
    ]
  }

  return (
    <div className="section-table">
      <div
        className="overflow-hidden rounded-xl border-2 border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] shadow-lg dark:shadow-xl">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-full xl:min-w-[1102px] overflow-y-auto max-h-[65vh] lg:max-h-[92vh] scrollbar-primary">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b-2 border-brand-200 dark:border-white/[0.1]">
                <TableRow className="rounded-lg overflow-hidden bg-gradient-to-r from-brand-500 to-brand-600 rounded-tr-lg rounded-tl-lg">
                  {itemsTEst?.headers?.map((h, i) => {
                    const columnKey = sortable?.columnKeys?.[i];
                    const isSortable = sortable && columnKey && columnKey !== '';
                    
                    return (
                      <TableCell
                        key={i}
                        isHeader
                        className="px-6 py-4 font-semibold text-white text-start text-sm tracking-wide uppercase sticky top-0 z-10 bg-gradient-to-br from-brand-500 to-brand-600 dark:from-brand-600 dark:to-brand-700 hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-sm"
                      >
                        <div 
                          className={`flex items-center justify-between gap-2 ${
                            isSortable ? 'cursor-pointer hover:scale-105 transition-transform select-none' : ''
                          }`}
                          onClick={() => isSortable && sortable.onSort(columnKey)}
                        >
                          <span className="font-bold text-[13px]">{h}</span>
                          {isSortable && getSortIcon(columnKey)}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {itemsTEst?.body?.map((b, i) => (
                  <TableRow key={i} className='hover:bg-brand-50 dark:hover:bg-white/[0.02] duration-200 transition-all'>
                    {b?.row?.map((c: any, j: number) => {
                      const isLastRow = i === data.body.length - 1;
                      return (
                        <TableCell className={`px-6 py-3.5 text-start text-sm cursor-pointer ${isLastRow && stickyLastRow ? 'sticky bottom-0 z-10 bg-brand-50 dark:bg-white/[0.03] !text-gray-dark font-semibold' : 'text-gray-700 dark:text-gray-300'}`} key={j}>
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
