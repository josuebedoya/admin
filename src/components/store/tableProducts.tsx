import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/cell";
import CellBadge from "@/components/store/cellBadge";
import {formattedMoney} from "@/utils/index";

interface TableCategoriesProps {
  items: {
    id: string | number;
    name: string;
    status: boolean;
    category: string;
    quantity: number;
    price: number;
    type_unity: string;
    category_id: string | number;
    shelf: string;
    shelf_id: string | number;
  }[]
}

const TableProducts = ({items}: TableCategoriesProps) => {

  const tableHeaders = ['ID', 'NOMBRE', 'CATEGORÍA', 'ESTANTERÍA', 'CANTIDAD', 'PRECIO', 'ESTADO']

  const transformItemsToTableBody = (items: TableCategoriesProps['items']) => {
    return items?.map((item, i) => ({
      row: [
        <Cell text={item?.id} path={`/tienda/productos/${item?.id}`} withLink key={i}/>,
        <Cell text={item?.name} path={`/tienda/productos/${item?.id}`} withLink key={i}/>,
        <Cell text={item?.category} path={`/tienda/categorias/${item?.category_id}`} withLink key={i}/>,
        <Cell text={item?.shelf} path={`/tienda/estanterias/${item?.shelf_id}`} withLink key={i}/>,
        <Cell text={`${item?.quantity} - ${item?.type_unity}`} key={i}/>,
        <Cell text={formattedMoney(item?.price)} key={i}/>,
        <CellBadge isActive={item?.status} isLast key={i}/>
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