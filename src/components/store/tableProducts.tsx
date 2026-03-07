import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/cell";
import CellBadge from "@/components/store/cellBadge";
import {formattedMoney} from "@/utils/index";

interface TableProductsProps {
  items: {
    id: string | number;
    name: string;
    status: boolean;
    category: string;
    quantity: number;
    price: number;
    price_sale: number;
    type_unity: string;
    category_id: string | number;
    shelf: string;
    shelf_id: string | number;
  }[];
  isDashboard?: boolean;
}

const TableProducts = ({items, isDashboard}: TableProductsProps) => {

  const tableHeaders = ['ID', 'NOMBRE', 'CATEGORÍA', 'ESTANTERÍA', 'CANTIDAD', 'PRECIO', 'ESTADO'];
  const dashboardHeaders = ['ID', 'NOMBRE', 'CANTIDAD', 'PRECIO VENTA', 'PRECIO COMPRA','TOTAL PRODUCTO', 'GANANCIA', 'ESTADO'];

  const calculateProfit = (price: number, price_sale: number, quantity: number) => {
    const profit = price - price_sale;
    return profit * quantity;
  };

  const transformItemsToTableBody = (items: TableProductsProps['items']) => {
    return items?.map((item, i) => {
      return {
        row: [
          <Cell text={item?.id} path={`/tienda/productos/${item?.id}`} withLink key={i}/>,
          <Cell text={item?.name} path={`/tienda/productos/${item?.id}`} withLink key={i}/>,

        (!isDashboard && <Cell text={item?.category} path={`/tienda/categorias/${item?.category_id}`} withLink key={i}/>),
        (!isDashboard && <Cell text={item?.shelf} path={`/tienda/estanterias/${item?.shelf_id}`} withLink key={i}/>),

          <Cell text={`${item?.quantity} - ${item?.type_unity}`} key={i}/>,

          <Cell text={formattedMoney(item?.price)} key={i}/>,
          (isDashboard && <Cell text={formattedMoney(item?.price_sale )} key={i}/>),
          (isDashboard && <Cell text={formattedMoney(item?.price * item?.quantity)} key={i}/>),
          (isDashboard && <Cell text={formattedMoney(calculateProfit(item?.price, item?.price_sale, item?.quantity))} key={i}/>),

          <CellBadge isActive={item?.status} isLast key={i}/>
        ].filter(Boolean)
      }
    })
  };

  const dataTable = {
    headers: isDashboard ? dashboardHeaders : tableHeaders,
    body: transformItemsToTableBody(items),
  }

  return <BasicTableOne data={dataTable}/>;
};

export default TableProducts;