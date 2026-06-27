'use client';

import BasicTableOne from "@/components/tables/BasicTableOne";
import Cell from "@/components/store/components/cell";
import CellBadge from "@/components/store/components/cellBadge";
import {usePaginatedTable} from "@/hooks/usePaginatedTable";
import {bulkUpdateCategories, fetchCategories, saveCategory} from "@/server/actions/store";
import {useRouter} from "next/navigation";
import {useState} from "react";
import EditableTable, {ColumnDef, EditableTableChange} from "@/components/store/components/EditableTable";
import {STATUS_OPTIONS} from "@/components/store/resources";

interface TableCategoriesProps {
  items: {
    id: string | number;
    name: string;
    status: boolean;
    products: number;
  }[];
  totalAmount?: number;
  currentPage?: number;
  pageSize?: number;
}

const CATEGORY_COLUMNS: ColumnDef[] = [
  {key: 'name', label: 'Nombre', type: 'text', sortable: true, minWidth: 200},
  {key: 'status', label: 'Estado', type: 'select', options: STATUS_OPTIONS, minWidth: 110},
];

const TableCategories = (
  {
    items: initialItems,
    totalAmount: initialTotalCount = 0,
    currentPage = 1,
    pageSize = 10
  }: TableCategoriesProps) => {
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
    queryKey: `'categories'-${refreshKey}`,
    initialData: initialItems,
    initialTotalCount,
    initialPage: currentPage,
    initialPageSize: pageSize,
    fetchFn: fetchCategories,
  });

  const router = useRouter();

  const handleBulkSave = async (changes: EditableTableChange[]) => {
    if (!changes.length) return;
    setSaving(true);
    try {
      const toUpdate = changes.filter(c => !c.isNew);
      const toCreate = changes.filter(c => c.isNew);
      const results = await Promise.all([
        ...(toUpdate.length > 0 ? [bulkUpdateCategories(toUpdate)] : []),
        ...toCreate.map(c => saveCategory(c.data, true)),
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
        columns={CATEGORY_COLUMNS}
        onSave={handleBulkSave}
        onCancel={() => setEditMode(false)}
        saving={saving}
        noBorder
      />
    );
  }

  const tableHeaders = ['ID', 'NOMBRE', 'ESTADO', 'PRODUCTOS'];

  const transformItemsToTableBody = (items: TableCategoriesProps['items']) => {
    return items?.map((item, i) => ({
      row: [
        <Cell text={item?.id} path={`/tienda/categorias/${item?.id}`} withLink key={i}/>,
        <Cell text={item?.name} path={`/tienda/categorias/${item?.id}`} withLink key={i}/>,
        <CellBadge isActive={item.status} key={i}/>,
        <Cell
          text={item?.products} isLast key={i}
          controls={{
            id: item.id, link: `/tienda/categorias/${item?.id}`, module: 'categories',
            onDeleted: () => setRefreshKey(prev => prev + 1),
          }}/>,
      ]
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
    columnKeys: ['id', 'name', 'status', 'products'],
    onSort: handleSort,
    sortBy,
    sortOrder,
  };

  return <BasicTableOne
    data={dataTable}
    pagination={paginationData}
    sortable={sortableData}
    buttonAdd={{onClick: () => router.push('/tienda/categorias/+'), label: 'Agregar Categoría'}}
    search={{
      onChange: handleSearchChange,
      value: searchTerm,
      placeholder: 'Buscar en categorias...'
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

export default TableCategories;
