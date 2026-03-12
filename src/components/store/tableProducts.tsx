'use client';

import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/components/cell";
import CellBadge from "@/components/store/components/cellBadge";
import {
  calculateProfit as profit,
  calculateProfitPercent,
  formattedMoney as fMat,
  getPromedioProfitPercent,
  getTotalAmount,
  getTotalAmountProduct,
  getTotalProfit
} from "@/utils/index";
import {usePaginatedTable} from "@/hooks/usePaginatedTable";
import {fetchProducts} from "@/server/actions/store";
import {useRouter} from "next/navigation";

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
  totalAmount?: number;
  isDashboard?: boolean;
  currentPage?: number;
  pageSize?: number;
  stickyLastRow?: boolean;
}

const TableProducts = ({
                         items: initialItems,
                         totalAmount: initialTotalCount = 0,
                         isDashboard,
                         currentPage = 1,
                         pageSize = 10,
                         stickyLastRow
                       }: TableProductsProps) => {

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
    queryKey: 'products',
    initialData: initialItems,
    initialTotalCount,
    initialPage: currentPage,
    initialPageSize: pageSize,
    fetchFn: fetchProducts,
  });
  const router = useRouter();


  const tableHeaders = ['ID', 'NOMBRE', 'CATEGORÍA', 'ESTANTERÍA', 'CANTIDAD', 'PRECIO', 'ESTADO'];
  const dashboardHeaders = ['ID', 'NOMBRE', 'CANTIDAD', 'PRECIO VENTA', 'PRECIO COMPRA', 'TOTAL PRODUCTO', 'GANANCIA', 'GANANCIA %', 'ESTADO'];

  const transformItemsToTableBody = (products: TableProductsProps[ 'items' ]) => {
    return products?.map((p, i) => ({
      row: [
        <Cell text={p?.id} path={`/tienda/productos/${p?.id}`} withLink key={i}/>,
        <Cell text={p?.name} path={`/tienda/productos/${p?.id}`} withLink key={i}/>,

        (!isDashboard && <Cell text={p?.category} path={`/tienda/categorias/${p?.category_id}`} withLink key={i}/>),
        (!isDashboard && <Cell text={p?.shelf} path={`/tienda/estanterias/${p?.shelf_id}`} withLink key={i}/>),

        <Cell text={`${p?.quantity} - ${p?.type_unity}`} key={i}/>,

        <Cell text={fMat(p?.price)} key={i}/>,
        (isDashboard && <Cell text={fMat(p?.price_sale)} key={i}/>),
        (isDashboard && <Cell text={fMat(p?.price * p?.quantity)} key={i}/>),
        (isDashboard && <Cell text={fMat(profit(p?.price, p?.price_sale, p?.quantity))} key={i}/>),
        (isDashboard && <Cell text={`${calculateProfitPercent(p?.price, p?.price_sale)}%`} key={i}/>),

        <CellBadge isActive={p?.status} isLast key={i}/>
      ].filter(Boolean)
    }))
  };

  const bodyRows = transformItemsToTableBody(items);

  if (isDashboard) {
    const totalPrice = getTotalAmount(items, 'price');
    const totalPriceSale = getTotalAmount(items, 'price_sale');
    const totalProfit = getTotalProfit(items);
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

    bodyRows.push({
      row: [
        <Cell text="TOTAL" key="total-label"/>,
        <Cell text="" key="total-name"/>,
        <Cell text={totalQuantity} key="total-quantity"/>,
        <Cell text={fMat(totalPrice)} key="total-price"/>,
        <Cell text={fMat(totalPriceSale)} key="total-price-sale"/>,
        <Cell text={fMat(getTotalAmountProduct(items))} key="total-product"/>,
        <Cell text={fMat(totalProfit)} key="total-profit"/>,
        <Cell text={getPromedioProfitPercent(items) + '%'} key="total-profit-percent"/>,
        <Cell text="" key="total-status"/>
      ]
    });
  }

  // Table data structure
  const dataTable = {
    headers: isDashboard ? dashboardHeaders : tableHeaders,
    body: bodyRows
  }

  // Pagination data
  const paginationData = {
    currentPage: page,
    totalAmount: totalCount,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    pageSize: size
  };

  // Sortable data
  const sortableData = {
    columnKeys: isDashboard
      ? ['id', 'name', 'quantity', 'price', 'price_sale', '', '', '', 'status']
      : ['id', 'name', 'category', 'shelf', 'quantity', 'price', 'status'],
    onSort: handleSort,
    sortBy,
    sortOrder,
  };

  // Open form to new product
  const openFormNewProduct = () => {
    router.push('/tienda/productos/+');
  };

  return <BasicTableOne
    data={dataTable}
    stickyLastRow={stickyLastRow}
    pagination={paginationData}
    sortable={sortableData}
    buttonAdd={{onClick: openFormNewProduct, label: 'Agregar Producto'}}
    search={{
      onChange: handleSearchChange,
      value: searchTerm,
      placeholder: 'Buscar en productos...'
    }}
  />;
};

export default TableProducts;