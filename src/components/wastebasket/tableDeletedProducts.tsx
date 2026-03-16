'use client';

import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/components/cell";
import CellBadge from "@/components/store/components/cellBadge";
import {usePaginatedTable} from "@/hooks/usePaginatedTable";
import {fetchProducts} from "@/server/actions/store";
import {Product} from "@/server/store/productRepository";
import {useState} from "react";
import {formattedDate} from "@/utils";

interface TableProductsProps {
  items: Product[];
  totalAmount?: number;
  isDashboard?: boolean;
  currentPage?: number;
  pageSize?: number;
  stickyLastRow?: boolean;
  readonly?: boolean;
  showAll?: boolean;
  keyCache?: string;
  disableServerFetch?: boolean;
  button?: {
    label: string;
    position?: 'left' | 'right';
    onActionButton?: 'create' | 'back';
  };
  idReport?: string;
  nameReport?: string;
  fetchFn?: (page: number, pageSize: number, orderBy?: string, ascending?: boolean, search?: string) => Promise<{
    items: TableProductsProps[ 'items' ];
    count: number;
  }>;
}

const TableDeletedProducts = (
  {
    items: initialItems,
    totalAmount: initialTotalCount = 0,
    currentPage = 1,
    pageSize = 10,
    stickyLastRow,
    readonly,
    keyCache,
    disableServerFetch = false,
    button,
    fetchFn
  }: TableProductsProps) => {

  const [refreshKey, setRefreshKey] = useState(0);

  // Usar el hook centralizado
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
    queryKey: `${keyCache ?? 'products-deleted'}-${refreshKey}`,
    initialData: initialItems,
    initialTotalCount,
    initialPage: currentPage,
    initialPageSize: pageSize,
    enableServerFetch: !disableServerFetch,
    fetchFn: fetchFn ?? fetchProducts,
    getDeleted: true
  });

  const tableHeaders = ['ID', 'NOMBRE', 'FECHA DE ELIMINACIÓN', 'ESTADO'];

  const transformItemsToTableBody = (products: TableProductsProps[ 'items' ]) => {
    return products?.map((p, i) => ({
      row: [
        <Cell text={p?.id} withLink={!readonly} key={i}/>,
        <Cell text={p?.name} withLink={!readonly} key={i}/>,
        <Cell text={formattedDate(p?.date_deleted)} withLink={!readonly} key={i}/>,
        <CellBadge isActive={p?.status} key={i} isLast
                   controls={{
                     id: p.id,
                     module: 'products',
                     op: {view: false, delete: false, restore: true, edit: false},
                     onRestored: () => {
                       setRefreshKey((prev) => prev + 1);
                     }
                   }}
        />
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
    columnKeys: ['id', 'name', 'date_deleted', 'status'],
    onSort: handleSort,
    sortBy,
    sortOrder,
  };

  return <BasicTableOne
    data={dataTable}
    stickyLastRow={stickyLastRow}
    pagination={paginationData}
    sortable={sortableData}
    search={{
      onChange: handleSearchChange,
      value: searchTerm,
      placeholder: 'Buscar en productos...'
    }}
  />;
};

export default TableDeletedProducts;