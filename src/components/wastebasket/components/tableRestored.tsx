'use client';

import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/components/cell";
import CellBadge from "@/components/store/components/cellBadge";
import {usePaginatedTable} from "@/hooks/usePaginatedTable";
import {useState} from "react";
import {formattedDate} from "@/utils";

type  Modules = 'products' | 'categories' | 'shelves' | 'daily-sales' | 'reports';

type Item = {
  id: number | string;
  name?: string;
  date_deleted: string | null;
  date_created?: string | null;
  status?: boolean;
  note?: string | null;
}

interface TableRestoredProps<T> {
  items: T[];
  totalAmount?: number;
  currentPage?: number;
  pageSize?: number;
  keyCache: string;
  fetchFn: (page: number, pageSize: number, orderBy?: string, ascending?: boolean, search?: string, getAll?: boolean, getDeleted?: boolean) => Promise<{
    items: TableRestoredProps<T>[ 'items' ];
    count: number;
  }>;
  module: Modules;
  isSaleTable?: boolean;
}

const TableRestored = (
  {
    items: initialItems,
    totalAmount: initialTotalCount = 0,
    currentPage = 1,
    pageSize = 10,
    keyCache,
    fetchFn,
    module,
    isSaleTable
  }: TableRestoredProps<Item>) => {

  const [refreshKey, setRefreshKey] = useState(0);

  const {
    items,
    currentPage: page,
    pageSize: size,
    totalCount,
    sortBy,
    sortOrder,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    searchTerm,
    handleSearchChange
  } = usePaginatedTable({
    queryKey: `${keyCache}-${refreshKey}`,
    initialData: initialItems,
    initialTotalCount,
    initialPage: currentPage,
    initialPageSize: pageSize,
    enableServerFetch: true,
    fetchFn: fetchFn,
    getDeleted: true
  });

  const tableHeaders = ['ID', 'NOMBRE', 'FECHA DE ELIMINACIÓN'];
  const withStatus = items[0]?.status !== undefined;

  if (withStatus) {
    tableHeaders.push('ESTADO');
  }

  const controls = (id: string | number, module: keyof typeof modules) => ({
    id,
    module,
    op: {view: false, delete: false, restore: true, edit: false},
    onRestored: () => {
      setRefreshKey((prev) => prev + 1);
    }
  });

  const transformItemsToTableBody = (items: TableRestoredProps<Item>[ 'items' ]) => {
    return items?.map((item, i) => ({
      row: [
        <Cell text={item?.id} withLink={false} key={i}/>,
        <Cell text={isSaleTable ? formattedDate(item?.date_created || null) : item?.name} withLink={false} key={i}/>,
        <Cell text={formattedDate(item?.date_deleted)} withLink={false} key={i} isLast={!withStatus}
              controls={controls(item.id, module)}/>,
        (withStatus && (<CellBadge
          isActive={item?.status || false}
          key={i} isLast
          controls={controls(item.id, module)}
        />))
      ].filter(Boolean)
    }))
  };

  const bodyRows = transformItemsToTableBody(items);

  // Table data structure
  const dataTable = {
    headers: tableHeaders,
    body: bodyRows
  }

  // Pagination data
  const paginationData = {
    currentPage: page,
    totalAmount: totalCount,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    pageSize: size
  };

  // Sortable data
  const sortableData = {
    columnKeys: ['id', isSaleTable ? 'date_created' : 'name', 'date_deleted', withStatus && 'status'].filter(Boolean) as string[],
    onSort: handleSort,
    sortBy,
    sortOrder,
  };

  const modules = {
    products: 'productos',
    categories: 'categorías',
    shelves: 'estantes',
    'daily-sales': 'ventas diarias',
    reports: 'reportes'
  }

  return <BasicTableOne
    data={dataTable}
    stickyLastRow={false}
    pagination={paginationData}
    sortable={sortableData}
    search={{
      onChange: handleSearchChange,
      value: searchTerm,
      placeholder: `Buscar en ${modules[module]}...`
    }}
  />;
};

export default TableRestored;
