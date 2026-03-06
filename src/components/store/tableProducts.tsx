import React from 'react';
import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/cell";
import CellBadge from "@/components/store/cellBadge";

interface TableCategoriesProps {
  items: {
    id: string;
    name: string;
    status: 'active' | 'inactive';
    category: string;
    quantity: number;
    price: number;
    category_id: string;
  }[]
}

const TableProducts = ({items}: TableCategoriesProps) => {

  const tableHeaders = ['ID', 'NOMBRE', 'CATEGORÍA', 'CANTIDAD', 'PRECIO', 'ESTADO']

  const transformItemsToTableBody = (items: TableCategoriesProps['items']) => {
    return items.map((item, i) => ({
      row: [
        <Cell text={item?.id} path={`/tienda/productos/${item?.id}`} withLink key={i}/>,
        <Cell text={item?.name} path={`/tienda/productos/${item?.id}`} withLink key={i}/>,
        <Cell text={item?.category} path={`/tienda/categoria/${item?.category_id}`} withLink key={i}/>,
        <Cell text={item?.quantity} key={i}/>,
        <Cell text={item?.price} key={i}/>,
        <CellBadge isActive={item?.status === 'active'} isLast key={i}/>
      ]
    }))
  };

  const dataTable = {
    headers: tableHeaders,
    body: transformItemsToTableBody(items),
  }

  return <BasicTableOne data={dataTable}/>;
};

export default TableProducts;