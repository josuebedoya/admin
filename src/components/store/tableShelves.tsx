'use client';

import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/components/cell";
import CellBadge from "@/components/store/components/cellBadge";
import {formattedMoney} from '@/utils';
import {usePaginatedTable} from "@/hooks/usePaginatedTable";
import {fetchShelves} from "@/server/actions/store";
import {useRouter} from "next/navigation";
import {useState} from "react";

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
  stickyLastRow?: boolean;
}

const TableShelves = (
  {
    items: initialItems,
    totalAmount: initialTotalCount = 0,
    currentPage = 1,
    pageSize = 10,
    stickyLastRow
  }: TableShelvesProps) => {
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
    queryKey: `'shelves'-${refreshKey}`,
    initialData: initialItems,
    initialTotalCount,
    initialPage: currentPage,
    initialPageSize: pageSize,
    fetchFn: fetchShelves,
  });

  const router = useRouter();

  const tableHeaders = ['ID', 'NOMBRE', 'ESTADO', 'PRODUCTOS', 'PRECIO TOTAL', 'PRECIO VENTA']

  const transformItemsToTableBody = (items: TableShelvesProps['items']) => {
    return items?.map((item, i) => ({
      row: [
        <Cell text={item?.id} path={`/tienda/estanterias/${item?.id}`} withLink key={i}/>,
        <Cell text={item?.name} path={`/tienda/estanterias/${item?.id}`} withLink key={i}/>,
        <CellBadge isActive={item.status} key={i}/>,
        <Cell text={item?.products} key={i}/>,
        <Cell text={formattedMoney(item?.total_price)} key={i}/>,
        <Cell
          text={formattedMoney(item?.total_price_sale)} isLast key={i}
          controls={{
            id: item.id, link: `/tienda/estanterias/${item?.id}`,
            module: 'shelves', onDeleted: () => {
              setRefreshKey((prev) => prev + 1);
            }
          }}/>,
      ]
    }))
  };

  const bodyRows = transformItemsToTableBody(items);

  // Agregar fila de totales
  const totalProducts = items.reduce((acc, item) => acc + item.products, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.total_price, 0);
  const totalPriceSale = items.reduce((acc, item) => acc + item.total_price_sale, 0);

  bodyRows.push({
    row: [
      <Cell text="TOTAL" key="total-label"/>,
      <Cell text="" key="total-name"/>,
      <Cell text="" key="total-status"/>,
      <Cell text={totalProducts} key="total-products"/>,
      <Cell text={formattedMoney(totalPrice)} key="total-price"/>,
      <Cell text={formattedMoney(totalPriceSale)} key="total-price-sale"/>,
    ]
  });

  const dataTable = {
    headers: tableHeaders,
    body: bodyRows,
  }

  const paginationData = {
    currentPage: page,
    totalAmount: totalCount,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    pageSize: size
  };

  const sortableData = {
    columnKeys: ['id', 'name', 'status', 'products', 'total_price', 'total_price_sale'],
    onSort: handleSort,
    sortBy,
    sortOrder,
  };

  const openFormNewShelf = () => {
    router.push('/tienda/estanterias/+');
  };

  return <BasicTableOne
    data={dataTable}
    stickyLastRow={stickyLastRow}
    pagination={paginationData}
    sortable={sortableData}
    buttonAdd={{onClick: openFormNewShelf, label: 'Agregar Estantería'}}
    search={{
      onChange: handleSearchChange,
      value: searchTerm,
      placeholder: 'Buscar en estanterías...'
    }}/>;
};

export default TableShelves;