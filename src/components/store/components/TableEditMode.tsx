'use client';

import EditableTable, {ColumnDef, EditableTableChange} from '@/components/store/components/EditableTable';
import {Product} from '@/server/store/productRepository';
import {STATUS_OPTIONS, TYPE_UNITIES} from '@/components/store/resources';
import {fetchCategories, fetchShelves} from '@/server/actions/store';

interface TableEditModeProps {
  items: Product[];
  onSave: (changes: EditableTableChange[]) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
  noBorder?: boolean;
}

const PRODUCT_COLUMNS: ColumnDef[] = [
  {key: 'name', label: 'Nombre', type: 'text', sortable: true, minWidth: 300},
  {
    key: 'category_id',
    label: 'Categoría',
    type: 'select',
    sortable: true,
    filterable: true,
    minWidth: 190,
    loadOptions: async () => {
      const res = await fetchCategories(1, 999, 'name', true, '', true);
      return (res?.items ?? []).map((c: any) => ({value: String(c.id), label: c.name}));
    },
  },
  {
    key: 'shelf_id',
    label: 'Estantería',
    type: 'select',
    sortable: true,
    filterable: true,
    minWidth: 130,
    loadOptions: async () => {
      const res = await fetchShelves(1, 999, 'name', true, '', true);
      return (res?.items ?? []).map((s: any) => ({value: String(s.id), label: s.name}));
    },
  },
  {key: 'quantity', label: 'Cantidad', type: 'number', min: 0, step: 1, minWidth: 70},
  {key: 'type_unity', label: 'Tipo Unidad', type: 'select', options: TYPE_UNITIES, minWidth: 110},
  {key: 'price', label: 'Precio Venta', type: 'number', min: 0, step: 0.01, minWidth: 80},
  {key: 'price_sale', label: 'Precio Compra', type: 'number', min: 0, step: 0.01, minWidth: 80},
  {key: 'status', label: 'Estado', type: 'select', options: STATUS_OPTIONS, minWidth: 100},
];

export default function TableEditMode({items, onSave, onCancel, saving, noBorder}: TableEditModeProps) {
  return (
    <EditableTable
      items={items}
      columns={PRODUCT_COLUMNS}
      onSave={onSave}
      onCancel={onCancel}
      saving={saving}
      noBorder={noBorder}
    />
  );
}
