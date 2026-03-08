import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/cell";
import CellBadge from "@/components/store/cellBadge";
import {
  formattedMoney as fMat, calculateProfit as profit, calculateProfitPercent,
  getTotalAmount, getTotalProfit, getPromedioProfitPercent, getTotalAmountProduct
} from "@/utils/index";

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

const TableProducts = ({ items, isDashboard }: TableProductsProps) => {

  const tableHeaders = [ 'ID', 'NOMBRE', 'CATEGORÍA', 'ESTANTERÍA', 'CANTIDAD', 'PRECIO', 'ESTADO' ];
  const dashboardHeaders = [ 'ID', 'NOMBRE', 'CANTIDAD', 'PRECIO VENTA', 'PRECIO COMPRA', 'TOTAL PRODUCTO', 'GANANCIA', 'GANANCIA %', 'ESTADO' ];

  const transformItemsToTableBody = (products: TableProductsProps[ 'items' ]) => {
    return products?.map((p, i) => ({
      row: [
        <Cell text={p?.id} path={`/tienda/productos/${p?.id}`} withLink key={i} />,
        <Cell text={p?.name} path={`/tienda/productos/${p?.id}`} withLink key={i} />,

        (!isDashboard && <Cell text={p?.category} path={`/tienda/categorias/${p?.category_id}`} withLink key={i} />),
        (!isDashboard && <Cell text={p?.shelf} path={`/tienda/estanterias/${p?.shelf_id}`} withLink key={i} />),

        <Cell text={`${p?.quantity} - ${p?.type_unity}`} key={i} />,

        <Cell text={fMat(p?.price)} key={i} />,
        (isDashboard && <Cell text={fMat(p?.price_sale)} key={i} />),
        (isDashboard && <Cell text={fMat(p?.price * p?.quantity)} key={i} />),
        (isDashboard && <Cell text={fMat(profit(p?.price, p?.price_sale, p?.quantity))} key={i} />),
        (isDashboard && <Cell text={`${calculateProfitPercent(p?.price, p?.price_sale)}%`} key={i} />),

        <CellBadge isActive={p?.status} isLast key={i} />
      ].filter(Boolean)
    }))
  };

  const bodyRows = transformItemsToTableBody(items);

  // Agregar fila de totales solo si es dashboard
  if (isDashboard) {
    const totalPrice = getTotalAmount(items, 'price');
    const totalPriceSale = getTotalAmount(items, 'price_sale');
    const totalProfit = getTotalProfit(items);
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

    bodyRows.push({
      row: [
        <Cell text="TOTAL" key="total-label" />,
        <Cell text="" key="total-name" />,
        <Cell text={totalQuantity} key="total-quantity" />,
        <Cell text={fMat(totalPrice)} key="total-price" />,
        <Cell text={fMat(totalPriceSale)} key="total-price-sale" />,
        <Cell text={fMat(getTotalAmountProduct(items))} key="total-product" />,
        <Cell text={fMat(totalProfit)} key="total-profit" />,
        <Cell text={getPromedioProfitPercent(items) + '%'} key="total-profit-percent" />,
        <Cell text="" key="total-status" />
      ]
    });
  }

  const dataTable = {
    headers: isDashboard ? dashboardHeaders : tableHeaders,
    body: bodyRows
  }

  return <BasicTableOne data={dataTable} />;
};

export default TableProducts;