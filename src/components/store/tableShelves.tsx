'use client';

import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/cell";
import CellBadge from "@/components/store/cellBadge";
import { formattedMoney } from '@/utils';
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { fetchShelves } from "@/server/actions/store";

interface TableShelvesProps {
  items: {
    id: string | number;
    name: string;
    status: boolean;
    products: number;
    total_price: number;
    total_price_sale: number;
  }[];
  totalAmount?: number;
  currentPage?: number;
  pageSize?: number;
}

const TableShelves = ({
  items: initialItems, 
  totalAmount: initialTotalCount = 0,
  currentPage = 1,
  pageSize = 10
}: TableShelvesProps) => {

  // Usar el hook centralizado
  const {
    items,
    currentPage: page,
    pageSize: size,
    totalCount,
    handlePageChange,
    handlePageSizeChange,
  } = usePaginatedTable({
    queryKey: 'shelves',
    initialData: initialItems,
    initialTotalCount,
    initialPage: currentPage,
    initialPageSize: pageSize,
    fetchFn: fetchShelves,
  });

  const tableHeaders = ['ID', 'NOMBRE', 'ESTADO', 'PRODUCTOS', 'PRECIO TOTAL', 'PRECIO VENTA']

  const transformItemsToTableBody = (items: TableShelvesProps['items']) => {
    return items?.map((item, i) => ({
      row: [
        <Cell text={item?.id} path={`/tienda/estanterias/${item?.id}`} withLink key={i}/>,
        <Cell text={item?.name} path={`/tienda/estanterias/${item?.id}`} withLink key={i}/>,
        <CellBadge isActive={item.status} key={i}/>,
        <Cell text={item?.products} key={i}/>,
        <Cell text={formattedMoney(item?.total_price)} key={i}/>,
        <Cell text={formattedMoney(item?.total_price_sale)} isLast key={i}/>,
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

  return <BasicTableOne data={dataTable} pagination={paginationData} />;
};

export default TableShelves;