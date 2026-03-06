import React from 'react';
import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/cell";
import CellBadge from "@/components/store/cellBadge";

interface TableCategoriesProps {
  items: {
    id: string | number;
    name: string;
    status: boolean;
    products: number;
  }[]
}

const TableCategories = ({items}: TableCategoriesProps) => {

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

  return <BasicTableOne data={dataTable}/>;
};

export default TableCategories;