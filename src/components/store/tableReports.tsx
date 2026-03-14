'use client';

import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/components/cell";
import { formattedDate } from "@/utils/index";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { fetchReports } from "@/server/actions/store";

interface TableReportsProps {
  items: {
    id: string | number;
    name: string;
    date_created: string;
  }[];
  totalAmount?: number;
  currentPage?: number;
  pageSize?: number;
}

const TableReports = ({
  items: initialItems,
  totalAmount: initialTotalCount = 0,
  currentPage = 1,
  pageSize = 10,
}: TableReportsProps) => {

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
    queryKey: 'reports',
    initialData: initialItems,
    initialTotalCount,
    initialPage: currentPage,
    initialPageSize: pageSize,
    fetchFn: fetchReports,
  });

  const tableHeaders = [ 'ID', 'NOMBRE', 'FECHA DE CREACIÓN' ];

  const transformItemsToTableBody = (products: TableReportsProps[ 'items' ]) => {
    return products?.map((r, i) => ({
      row: [
        <Cell text={r?.id} path={`/dashboard/reportes/${r?.id}`} withLink key={i} />,
        <Cell text={r?.name} path={`/dashboard/reportes/${r?.id}`} withLink key={i} />,
        <Cell text={formattedDate(r?.date_created, 'long')} path={`/dashboard/reportes/${r?.id}`} withLink
          key={i} isLast />,
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
    columnKeys: [ 'id', 'name', 'quantity', 'date_created' ],
    onSort: handleSort,
    sortBy,
    sortOrder,
  };


  return <BasicTableOne
    data={dataTable}
    pagination={paginationData}
    sortable={sortableData}
    search={{
      onChange: handleSearchChange,
      value: searchTerm,
      placeholder: 'Buscar en reportes...'
    }}
  />;
};

export default TableReports;