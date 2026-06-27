'use client';

import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/components/cell";
import {formattedDate, formattedMoney} from "@/utils";
import {usePaginatedTable} from "@/hooks/usePaginatedTable";
import {bulkUpdateDailySales, fetchDailySales, saveDailySale} from "@/server/actions/store";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {DailySale} from "@/server/store/dailySaleRepository";
import EditableTable, {ColumnDef, EditableTableChange} from "@/components/store/components/EditableTable";

interface TableSalesProps {
  items: DailySale[];
  totalAmount?: number;
  currentPage?: number;
  pageSize?: number;
}

const SALE_COLUMNS: ColumnDef[] = [
  {
    key: 'date_created',
    label: 'Día',
    type: 'datetime-local',
    sortable: true,
    minWidth: 185,
    toInputValue: (raw) => {
      if (!raw) return '';
      try {
        // Ensure format: YYYY-MM-DDTHH:mm
        return new Date(raw).toISOString().slice(0, 16);
      } catch {
        return String(raw).slice(0, 16);
      }
    },
  },
  {key: 'transferred', label: 'Transferido', type: 'number', min: 0, step: 0.01, minWidth: 120},
  {key: 'cashed', label: 'Efectivo', type: 'number', min: 0, step: 0.01, minWidth: 120},
  {key: 'note', label: 'Nota', type: 'textarea', minWidth: 200},
];

const TableSales = (
  {
    items: initialItems,
    totalAmount: initialTotalCount = 0,
    currentPage = 1,
    pageSize = 10
  }: TableSalesProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

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
    queryKey: `'sales'-${refreshKey}`,
    initialData: initialItems,
    initialTotalCount,
    initialPage: currentPage,
    initialPageSize: pageSize,
    fetchFn: fetchDailySales
  });

  const router = useRouter();

  const handleBulkSave = async (changes: EditableTableChange[]) => {
    if (!changes.length) return;
    setSaving(true);
    try {
      const toUpdate = changes.filter(c => !c.isNew);
      const toCreate = changes.filter(c => c.isNew);
      const results = await Promise.all([
        ...(toUpdate.length > 0 ? [bulkUpdateDailySales(toUpdate)] : []),
        ...toCreate.map(c => saveDailySale(c.data, true)),
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

  if (editMode) {
    return (
      <EditableTable
        items={items}
        columns={SALE_COLUMNS}
        onSave={handleBulkSave}
        onCancel={() => setEditMode(false)}
        saving={saving}
        noBorder
      />
    );
  }

  const tableHeaders = ['ID', 'DÍA', 'TRANSFERIDO', 'EFECTIVO', 'TOTAL', 'NOTA'];

  const transformItemsToTableBody = (items: TableSalesProps['items']) => {
    return items?.map((item, i) => ({
      row: [
        <Cell text={item?.id} path={`/dashboard/ventas-diarias/${item?.id}`} withLink key={i}/>,
        <Cell text={formattedDate(item?.date_created, 'long')} path={`/dashboard/ventas-diarias/${item?.id}`} withLink key={i}/>,
        <Cell text={formattedMoney(item?.transferred)} key={i}/>,
        <Cell text={formattedMoney(item?.cashed)} key={i}/>,
        <Cell text={formattedMoney(item?.transferred + item?.cashed)} key={i}/>,
        <Cell text={item?.note} isLast key={i}
          controls={{
            id: item.id, link: `/dashboard/ventas-diarias/${item?.id}`,
            module: 'daily-sales', onDeleted: () => setRefreshKey(prev => prev + 1),
          }}/>,
      ].filter(Boolean)
    }))
  };

  const dataTable = {
    headers: tableHeaders,
    body: transformItemsToTableBody(items),
  };

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

  return <BasicTableOne
    data={dataTable}
    pagination={paginationData}
    sortable={sortableData}
    buttonAdd={{onClick: () => router.push('/dashboard/ventas-diarias/+'), label: 'Agregar Venta', position: 'right'}}
    search={{
      onChange: handleSearchChange,
      value: searchTerm,
      placeholder: 'Buscar en ventas...'
    }}
    headContent={
      items.length > 0 ? (
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
      ) : undefined
    }
  />;
};

export default TableSales;
