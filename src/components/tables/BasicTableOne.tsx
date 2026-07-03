"use client";

import {useMemo, useState} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "../ui/table";
import ButtonControl from "./buttonControl";
import Pagination from "./Pagination";
import SearchEngine from "@/components/common/searchEngine";
import Alert from "@/components/ui/alert/Alert";
import ColumnControls from "./ColumnControls";
import {useColumnManager} from "@/hooks/useColumnManager";

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
    columnKeys: string[];
    onSort: (column: string) => void;
    sortBy: string | null;
    sortOrder: 'asc' | 'desc';
  };
  buttonAdd?: {
    onClick: () => void;
    label: string;
    position?: 'left' | 'right';
    icon?: React.ReactNode;
  };
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string
  },
  headContent?: React.ReactNode;
  /** Unique id used to persist column visibility/order in localStorage. Defaults to a hash of the headers. */
  tableId?: string;
};

export default function BasicTableOne(
  {
    data,
    stickyLastRow,
    pagination,
    sortable,
    buttonAdd,
    search,
    headContent,
    tableId
  }: TableProps) {

  // Build stable per-column keys: prefer sortable.columnKeys when unique/non-empty, fallback to header text/index.
  const columnKeys = useMemo(() => {
    const raw = data?.headers?.map((h, i) => {
      const sortKey = sortable?.columnKeys?.[i];
      return sortKey && sortKey !== '' ? `k:${sortKey}` : `h:${h}:${i}`;
    }) ?? [];
    const seen = new Map<string, number>();
    return raw.map(k => {
      const count = seen.get(k) ?? 0;
      seen.set(k, count + 1);
      return count === 0 ? k : `${k}#${count}`;
    });
  }, [data?.headers, sortable?.columnKeys]);

  const columnMeta = useMemo(
    () => (data?.headers ?? []).map((h, i) => ({key: columnKeys[i], label: h})),
    [data?.headers, columnKeys]
  );

  const storageKey = `table-columns:${tableId ?? (data?.headers ?? []).join('|')}`;
  const {
    visibleColumns, isHidden, toggleVisible, moveColumn, resetColumns,
    getWidth, increaseWidth, decreaseWidth, minColumnWidth, maxColumnWidth,
  } = useColumnManager(storageKey, columnMeta);

  const [dragKey, setDragKey] = useState<string | null>(null);

  const keyToIndex = useMemo(() => {
    const map = new Map<string, number>();
    columnKeys.forEach((k, i) => map.set(k, i));
    return map;
  }, [columnKeys]);

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

  const emptyState = !data?.body || data.body.length === 0 || (data.body.length === 1 && stickyLastRow);

  const btnData = buttonAdd ? {
    onClick: buttonAdd.onClick,
    label: buttonAdd.label,
    icon: buttonAdd.icon,
    position: buttonAdd.position ?? 'right',
  } : null;

  return (
    <div className="flex flex-col gap-0">
      {/* ── Controls ── */}
      <div
        className={`flex items-center mb-4 gap-2 ${btnData?.position === 'left' ? 'justify-between' : 'justify-end'}`}>
        {(btnData && btnData.position === 'left') && (
          <ButtonControl {...btnData}/>
        )}

        {search && <SearchEngine value={search.value} onChange={search.onChange} placeholder={search.placeholder}/>}

        {(btnData && btnData.position === 'right') && (
          <ButtonControl {...btnData}/>
        )}
        {headContent}
          {columnMeta.length > 0 && (
          <ColumnControls
            columns={columnMeta}
            isHidden={isHidden}
            onToggle={toggleVisible}
            onReset={resetColumns}
            getWidth={getWidth}
            onIncreaseWidth={increaseWidth}
            onDecreaseWidth={decreaseWidth}
            minWidth={minColumnWidth}
            maxWidth={maxColumnWidth}
          />
        )}
      </div>
      {/* ── Tabla ── */}
      <div className=" rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-full overflow-x-auto rounded-xl">
          <div className="min-w-full xl:min-w-[1102px] overflow-y-auto max-h-[60vh] lg:max-h-[70vh] scrollbar-primary">
            {!emptyState ? (
              <Table>
                {/* Header */}
                <TableHeader>
                  <TableRow
                    className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/[0.05]">
                    {visibleColumns.map((col) => {
                      const i = keyToIndex.get(col.key) ?? -1;
                      const h = col.label;
                      const columnKey = sortable?.columnKeys?.[i];
                      const isSortable = sortable && columnKey && columnKey !== '';
                      const isDragging = dragKey === col.key;
                      const width = getWidth(col.key);
                      return (
                        <TableCell
                          key={col.key}
                          isHeader
                          className={`px-3 py-3 text-start text-[11px] md:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap sticky top-0 z-10 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm select-none ${isDragging ? 'opacity-40' : ''}`}
                          style={{width, minWidth: width, maxWidth: width}}
                        >
                          <div
                            draggable
                            onDragStart={() => setDragKey(col.key)}
                            onDragEnd={() => setDragKey(null)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (dragKey) moveColumn(dragKey, col.key);
                              setDragKey(null);
                            }}
                            className={`flex items-center gap-1.5 cursor-move ${isSortable ? 'group' : ''}`}
                          >
                            <svg className="w-3 h-3 text-gray-300 dark:text-gray-600 shrink-0" fill="currentColor" viewBox="0 0 8 14">
                              <circle cx="1.5" cy="1.5" r="1.5"/><circle cx="6.5" cy="1.5" r="1.5"/>
                              <circle cx="1.5" cy="7" r="1.5"/><circle cx="6.5" cy="7" r="1.5"/>
                              <circle cx="1.5" cy="12.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/>
                            </svg>
                            <div
                              className={`flex items-center gap-2 ${isSortable ? 'cursor-pointer' : ''}`}
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
                        {visibleColumns.map((col) => {
                          const j = keyToIndex.get(col.key) ?? -1;
                          const c = b?.row?.[j];
                          const width = getWidth(col.key);
                          return (
                            <TableCell
                              key={col.key}
                              className={`px-3 py-3 text-sm whitespace-nowrap text-start truncate
                              ${isLastRow && stickyLastRow
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-600 dark:text-gray-300'
                              }`}
                              style={{width, minWidth: width, maxWidth: width}}
                            >
                              {c}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : <Alert variant='info' title='No hay elementos'
                       message='No se encontraron elementos para mostrar en la tabla.'/>
            }
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
