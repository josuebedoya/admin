'use client';

import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/components/cell";
import CellBadge from "@/components/store/components/cellBadge";
import {usePaginatedTable} from "@/hooks/usePaginatedTable";
import {fetchCategories} from "@/server/actions/store";
import {useRouter} from "next/navigation";

interface TableCategoriesProps {
  items: {
    id: string | number;
    name: string;
    status: boolean;
    products: number;
  }[];
  totalAmount?: number;
  currentPage?: number;
  pageSize?: number;
}

const TableCategories = ({
                           items: initialItems,
                           totalAmount: initialTotalCount = 0,
                           currentPage = 1,
                           pageSize = 10
                         }: TableCategoriesProps) => {

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
    queryKey: 'categories',
    initialData: initialItems,
    initialTotalCount,
    initialPage: currentPage,
    initialPageSize: pageSize,
    fetchFn: fetchCategories,
  });

  const router = useRouter();

  const tableHeaders = ['ID', 'NOMBRE', 'ESTADO', 'PRODUCTOS']

  const transformItemsToTableBody = (items: TableCategoriesProps['items']) => {
    return items?.map((item, i) => ({
      row: [
        <Cell text={item?.id} path={`/tienda/categorias/${item?.id}`} withLink key={i}/>,
        <Cell text={item?.name} path={`/tienda/categorias/${item?.id}`} withLink key={i}/>,
        <CellBadge isActive={item.status} key={i}/>,
        <Cell text={item?.products} isLast key={i}/>,
      ]
    }))
  };

  const dataTable = {
    headers: tableHeaders,
    body: transformItemsToTableBody(items),
  }

  const paginationData = {
    currentPage: page,
    totalAmount: totalCount,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    pageSize: size
  };

  const sortableData = {
    columnKeys: ['id', 'name', 'status', 'products'],
    onSort: handleSort,
    sortBy,
    sortOrder,
  };

  const openFormNewCategory = () => {
    router.push('/tienda/categorias/+');
  };

  return <BasicTableOne
    data={dataTable}
    pagination={paginationData}
    sortable={sortableData}
    buttonAdd={{onClick: openFormNewCategory, label: 'Agregar Categoría'}}
    search={{
      onChange: handleSearchChange,
      value: searchTerm,
      placeholder: 'Buscar en categorias...'
    }}
  />;
};

export default TableCategories;