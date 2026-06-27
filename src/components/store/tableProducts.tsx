'use client';

import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/components/cell";
import CellBadge from "@/components/store/components/cellBadge";
import {
  calculateProfit as profit,
  calculateProfitPercent,
  formattedMoney as fMat,
  getPromedioProfitPercent,
  getTotalAmountProduct,
  getTotalProfit
} from "@/utils/index";
import {usePaginatedTable} from "@/hooks/usePaginatedTable";
import {bulkUpdateProducts, fetchActiveProducts, fetchInactiveProducts, fetchProducts, saveProduct, saveProductSnapshot} from "@/server/actions/store";
import ButtonVaciar from "@/components/store/components/ButtonVaciar";
import {useRouter} from "next/navigation";
import {ArrowRightIcon} from "@/icons";
import ButtonReport from "./components/buttonReport";
import ButtonDownloadReport from "./components/buttonDownladReport";
import {Product} from "@/server/store/productRepository";
import {useState} from "react";
import {TYPE_UNITIES} from "@/components/store/resources";
import TableEditMode from "@/components/store/components/TableEditMode";

interface TableProductsProps {
  items: Product[];
  totalAmount?: number;
  isDashboard?: boolean;
  currentPage?: number;
  pageSize?: number;
  stickyLastRow?: boolean;
  readonly?: boolean;
  showAll?: boolean;
  keyCache?: string;
  disableServerFetch?: boolean;
  mode?: 'active' | 'inactive';
  button?: {
    label: string;
    position?: 'left' | 'right';
    onActionButton?: 'create' | 'back';
  };
  idReport?: string;
  nameReport?: string;
  fetchFn?: (page: number, pageSize: number, orderBy?: string, ascending?: boolean, search?: string) => Promise<{
    items: TableProductsProps[ 'items' ];
    count: number;
  }>;
}

const TableProducts = (
  {
    items: initialItems,
    totalAmount: initialTotalCount = 0,
    isDashboard,
    currentPage = 1,
    pageSize = 10,
    stickyLastRow,
    readonly,
    showAll,
    keyCache,
    disableServerFetch = false,
    mode,
    button,
    fetchFn,
    idReport,
    nameReport
  }: TableProductsProps) => {

  const [refreshKey, setRefreshKey] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleBulkSave = async (changes: Array<{id: string | number; data: Record<string, any>; isNew?: boolean}>) => {
    if (changes.length === 0) return;
    setSaving(true);
    try {
      const toUpdate = changes.filter(c => !c.isNew);
      const toCreate = changes.filter(c => c.isNew);
      const results = await Promise.all([
        ...(toUpdate.length > 0 ? [bulkUpdateProducts(toUpdate)] : []),
        ...toCreate.map(c => saveProduct(c.data, true)),
      ]);
      const failed = results.filter(r => !r.success);
      if (failed.length > 0) {
        alert(failed[0].error || 'Error al guardar los cambios');
      } else {
        setEditMode(false);
        setRefreshKey(prev => prev + 1);
      }
    } finally {
      setSaving(false);
    }
  };

  const defaultFetchFn = mode === 'inactive' ? fetchInactiveProducts : mode === 'active' ? fetchActiveProducts : fetchProducts;

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
    queryKey: `${keyCache ?? 'products'}-${refreshKey}`,
    initialData: initialItems,
    initialTotalCount,
    initialPage: currentPage,
    initialPageSize: pageSize,
    enableServerFetch: !disableServerFetch,
    fetchFn: fetchFn ?? defaultFetchFn,
  });
  const router = useRouter();

  const tableHeaders = mode ? ['ID', 'NOMBRE', 'CATEGORÍA', 'ESTANTERÍA', 'CANTIDAD', 'PRECIO'] : ['ID', 'NOMBRE', 'CATEGORÍA', 'ESTANTERÍA', 'CANTIDAD', 'PRECIO', 'ESTADO'];
  const dashboardHeaders = ['ID', 'NOMBRE', 'CANTIDAD', 'PRECIO VENTA', 'PRECIO COMPRA', 'TOTAL PRODUCTO', 'GANANCIA', 'GANANCIA %'];

  if (showAll) {
    dashboardHeaders.splice(2, 0, 'CATEGORÍA', 'ESTANTERÍA');
  }

  const transformItemsToTableBody = (products: TableProductsProps[ 'items' ]) => {
    return products?.map((p, i) => ({
      row: [
        <Cell text={p?.id} path={`/tienda/productos/${p?.id}`} withLink={!readonly} key={i}/>,
        <Cell text={p?.name} path={`/tienda/productos/${p?.id}`} withLink={!readonly} key={i}/>,

        ((!isDashboard || showAll) &&
          <Cell text={p?.category} path={`/tienda/categorias/${p?.category_id}`} withLink={!readonly} key={i}/>),
        ((!isDashboard || showAll) &&
          <Cell text={p?.shelf} path={`/tienda/estanterias/${p?.shelf_id}`} withLink={!readonly} key={i}/>),

        <Cell text={`${p?.quantity} - ${TYPE_UNITIES?.find(t => t.value === p?.type_unity)?.label}`} key={i}/>,

        <Cell
          text={fMat(p?.price)} key={i}
          isLast={!!mode && !isDashboard}
          controls={mode ? {
            id: p.id,
            link: `/tienda/productos/${p.id}`,
            module: 'products',
            op: mode === 'inactive' ? {edit: false, delete: false, activate: true} : undefined,
            onDeleted: () => setRefreshKey((prev) => prev + 1),
            onActivated: () => setRefreshKey((prev) => prev + 1),
          } : undefined}
        />,
        (isDashboard && <Cell text={fMat(p?.price_sale)} key={i}/>),
        (isDashboard && <Cell text={fMat(p?.price_sale * p?.quantity)} key={i}/>),
        (isDashboard && <Cell text={fMat(profit(p?.price, p?.price_sale, p?.quantity))} key={i}/>),
        (isDashboard && <Cell text={`${calculateProfitPercent(p?.price, p?.price_sale)}%`} key={i} isLast={isDashboard}/>)
      ].filter(Boolean)
    }))
  };

  const bodyRows = transformItemsToTableBody(items);

  if (isDashboard) {
    const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalPriceSale = items.reduce((acc, item) => acc + (item.price_sale * item.quantity), 0);
    const totalProfit = getTotalProfit(items);
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

    bodyRows.push({
      row: [
        <Cell text="TOTAL" key="total-label"/>,
        <Cell text="" key="total-name"/>,
        (showAll && <Cell text="" key="total-category"/>),
        (showAll && <Cell text="" key="total-shelf"/>),
        <Cell text={totalQuantity} key="total-quantity"/>,
        <Cell text={fMat(totalPrice)} key="total-price"/>,
        <Cell text={fMat(totalPriceSale)} key="total-price-sale"/>,
        <Cell text={fMat(getTotalAmountProduct(items))} key="total-product"/>,
        <Cell text={fMat(totalProfit)} key="total-profit"/>,
        <Cell text={getPromedioProfitPercent(items) + '%'} key="total-profit-percent"/>,
        <Cell text="" key="total-status"/>
      ].filter(Boolean)
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
      : mode ? ['id', 'name', 'category', 'shelf', 'quantity', 'price'] : ['id', 'name', 'category', 'shelf', 'quantity', 'price', 'status'],
    onSort: handleSort,
    sortBy,
    sortOrder,
  };

  // Open form to new product
  const actionButton = () => {
    if (button?.onActionButton === 'back') {
      router.back();
    } else {
      router.push('/tienda/productos/+');
    }
  };

  if (editMode) {
    return (
      <TableEditMode
        items={items}
        onSave={handleBulkSave}
        onCancel={() => setEditMode(false)}
        saving={saving}
        noBorder
      />
    );
  }

  const editTableButton = !readonly && !isDashboard && items.length > 0 ? (
    <button
      type="button"
      onClick={() => setEditMode(true)}
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors whitespace-nowrap"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 10h18M3 14h18M10 3v18M14 3v18"/>
      </svg>
      Editar como tabla
    </button>
  ) : null;

  return <BasicTableOne
    data={dataTable}
    stickyLastRow={stickyLastRow}
    pagination={paginationData}
    sortable={sortableData}
    buttonAdd={{
      onClick: actionButton, label: button?.label || 'Agregar Producto', position: button?.position || 'right',
      icon: button?.onActionButton === 'back' ? (<div className="rotate-180"><ArrowRightIcon/></div>) : '+'
    }}
    search={{
      onChange: handleSearchChange,
      value: searchTerm,
      placeholder: 'Buscar en productos...'
    }}
    headContent={(<>
      {editTableButton}
      {mode === 'active' && <ButtonVaciar onVaciar={() => setRefreshKey((prev) => prev + 1)}/>}
      {!readonly && !mode && <ButtonReport onGenerate={saveProductSnapshot}/>}
      {readonly && <ButtonDownloadReport nameReport={nameReport} id={idReport || ''}/>}
    </>)}
  />;
};

export default TableProducts;