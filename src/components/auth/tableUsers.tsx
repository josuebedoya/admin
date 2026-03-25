'use client';

import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/components/cell";
import {usePaginatedTable} from "@/hooks/usePaginatedTable";
import {fetchUsers} from "@/server/auth/actions";
import {User} from "@/server/auth/getUsers";

interface TableUsersProps {
  items: User[];
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
    items: TableUsersProps[ 'items' ];
    count: number;
  }>;
}

const TableUsers = (
  {
    items: initialItems,
    totalAmount: initialTotalCount = 0,
    currentPage = 1,
    pageSize = 10,
    stickyLastRow,
    keyCache,
    disableServerFetch = false,
    fetchFn,
  }: TableUsersProps) => {

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
    queryKey: `users-${keyCache}`,
    initialData: initialItems,
    initialTotalCount,
    initialPage: currentPage,
    initialPageSize: pageSize,
    enableServerFetch: !disableServerFetch,
    fetchFn: fetchFn ?? fetchUsers,
  });

  const tableHeaders = ['ID', 'NOMBRE', 'ROL', 'EMAIL', 'TELÉFONO'];

  console.log(items)
  const transformItemsToTableBody = (products: TableUsersProps[ 'items' ]) => {
    return products?.map((p, i) => ({
      row: [
        <Cell text={p?.id} path={`/usuarios/${p?.id}`} withLink key={i}/>,
        <Cell text={p?.name} path={`/usuarios/${p?.id}`} withLink key={i}/>,
        <Cell text={p?.role || ''} path={`/usuarios/${p?.id}`} withLink key={i}/>,
        <Cell text={p?.email} path={`/usuarios/${p?.id}`} withLink key={i}/>,
        <Cell text={p?.phone} path={`/usuarios/${p?.id}`} withLink key={i}/>,
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
    columnKeys: ['id', 'name', 'role', 'email', 'phone'],
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
      placeholder: 'Buscar en usuarios...'
    }}
  />;
};

export default TableUsers;