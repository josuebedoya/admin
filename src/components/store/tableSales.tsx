'use client';

import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/components/cell";
import {formattedDate, formattedMoney} from "@/utils";
import {usePaginatedTable} from "@/hooks/usePaginatedTable";
import {fetchDailySales} from "@/server/actions/store";
import {useRouter} from "next/navigation";

interface TableSalesProps {
  items: {
    id: string | number;
    transferred: number;
    cashed: number;
    note: number;
    date_created: string;
  }[];
  totalAmount?: number;
  currentPage?: number;
  pageSize?: number;
}

const TableSales = ({
                      items: initialItems,
                      totalAmount: initialTotalCount = 0,
                      currentPage = 1,
                      pageSize = 10
                    }: TableSalesProps) => {

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
    queryKey: 'sales',
    initialData: initialItems,
    initialTotalCount,
    initialPage: currentPage,
    initialPageSize: pageSize,
    fetchFn: fetchDailySales
  });

  const router = useRouter();

  const tableHeaders = ['ID', 'DÍA', 'TRANSFERIDO', 'EFECTIVO', 'TOTAL', 'NOTA'];

  const transformItemsToTableBody = (items: TableSalesProps['items']) => {
    return items?.map((item, i) => {
      return {
        row: [
          <Cell text={item?.id} path={`/dashboard/ventas-diarias/${item?.id}`} withLink key={i}/>,
          <Cell text={formattedDate(item?.date_created, 'long')} path={`/dashboard/ventas-diarias/${item?.id}`} withLink
                key={i}/>,
          <Cell text={formattedMoney(item?.transferred)} key={i}/>,
          <Cell text={formattedMoney(item?.cashed)} key={i}/>,
          <Cell text={formattedMoney(item?.transferred + item?.cashed)} key={i}/>,
          <Cell text={item?.note} isLast key={i}
                controls={{id: item.id, link: `/dashboard/ventas-diarias/${item?.id}`}}/>,
        ].filter(Boolean)
      }
    })
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
    columnKeys: ['id', 'date_created', 'transferred', 'cashed', '', 'note'],
    onSort: handleSort,
    sortBy,
    sortOrder,
  };

  const openFormNewSale = () => {
    router.push('/dashboard/ventas-diarias/+');
  };

  return <BasicTableOne
    data={dataTable}
    pagination={paginationData}
    sortable={sortableData}
    buttonAdd={{onClick: openFormNewSale, label: 'Agregar Venta'}}
    search={{
      onChange: handleSearchChange,
      value: searchTerm,
      placeholder: 'Buscar en ventas...'
    }}/>;
};

export default TableSales;