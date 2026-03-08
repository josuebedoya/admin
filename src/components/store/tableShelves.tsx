import React from 'react';
import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/cell";
import CellBadge from "@/components/store/cellBadge";
import { formattedMoney } from '@/utils';

interface TableShelvesProps {
  items: {
    id: string | number;
    name: string;
    status: boolean;
    products: number;
    total_price: number;
    total_price_sale: number;
  }[]
}

const TableShelves = ({items}: TableShelvesProps) => {

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

  return <BasicTableOne data={dataTable}/>;
};

export default TableShelves;