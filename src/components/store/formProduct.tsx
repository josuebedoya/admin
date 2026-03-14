'use client';

import {useCallback, useEffect, useMemo, useState} from "react";
import Loader from '@/icons/loader.svg';
import Alert from "@/components/ui/alert/Alert";
import {fetchCategories, fetchShelves, saveProduct} from "@/server/actions/store";
import {MAX_PRICE, STATUS_OPTIONS, TYPE_UNITIES} from "@/components/store/resources";
import FormBase from "@/components/store/components/FormBase";
import {dictionary} from "@/dictionary";

type FormFields = {
  name: string;
  price: number | null;
  price_sale: number | null;
  shelf: string;
  shelf_id: number | null | string;
  category: string;
  category_id: number | null | string;
  quantity: number | null;
  type_unity: string;
  status: boolean;
}

type FormProductProps = {
  product?: {
    id: string | number;
    name: string;
    status: boolean;
    category_id: string | number;
    shelf_id: string | number;
    category: string;
    shelf: string;
    quantity: number;
    type_unity: string;
    price: number;
    price_sale: number;
  } | null;
  isNew: boolean;
};

export default function ProductForm({product, isNew}: FormProductProps) {
  const toSelectOptions = useCallback((items: Array<{ id: string | number; name: string }>) => {
    return items.map((item) => ({
      value: String(item.id),
      label: item.name,
    }));
  }, []);

  const [dataForm, setDataForm] = useState<FormFields>({
    name: product ? product.name : "",
    price: product ? product.price : null,
    price_sale: product ? product.price_sale : null,
    shelf: product ? product.shelf : "",
    shelf_id: product ? product.shelf_id : null,
    category: product ? product.category : '',
    category_id: product ? product.category_id : null,
    quantity: product ? product.quantity : null,
    type_unity: product ? product.type_unity : 'unity',
    status: product ? product.status : true,
  });

  const [categories, setCategories] = useState<{ value: string | number; label: string }[]>([]);
  const [shelves, setShelves] = useState<{ value: string | number; label: string }[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [categoriesResult, shelvesResult] = await Promise.all([
          fetchCategories(1, 100),
          fetchShelves(1, 100)
        ]);

        setCategories(toSelectOptions(categoriesResult.items));
        setShelves(toSelectOptions(shelvesResult.items));
      } catch (error) {
        setDataError(error instanceof Error ? error.message : 'Error cargando datos');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [toSelectOptions]);

  const searchCategories = useCallback(async (query: string) => {
    const result = await fetchCategories(1, 100, undefined, undefined, query || undefined);
    const formatted = toSelectOptions(result.items);
    return formatted;
  }, [toSelectOptions]);

  const searchShelves = useCallback(async (query: string) => {
    const result = await fetchShelves(1, 100, undefined, undefined, query || undefined);
    const formatted = toSelectOptions(result.items);
    return formatted;
  }, [toSelectOptions]);

  const handleSubmit = async (rawData: Record<string, string>, currentIsNew: boolean, id?: string | number) => {
    const parsedData: FormFields = {
      name: (rawData.name ?? '').trim(),
      price: rawData.price === '' || rawData.price == null ? null : Number(rawData.price),
      price_sale: rawData.price_sale === '' || rawData.price_sale == null ? null : Number(rawData.price_sale),
      shelf: rawData.shelf ?? '',
      shelf_id: rawData.shelf_id === '' || rawData.shelf_id == null ? null : rawData.shelf_id,
      category: rawData.category ?? '',
      category_id: rawData.category_id === '' || rawData.category_id == null ? null : rawData.category_id,
      quantity: rawData.quantity === '' || rawData.quantity == null ? null : Number(rawData.quantity),
      type_unity: rawData.type_unity ?? '',
      status: rawData.status === 'true',
    };

    if (!parsedData.name) {
      return {success: false, message: 'El nombre es requerido'};
    }
    if (parsedData.price === null || !Number.isFinite(parsedData.price) || parsedData.price <= 0 || parsedData.price > MAX_PRICE) {
      return {success: false, message: dictionary.msg.INVALID_AMOUNT_PRICE};
    }
    if (parsedData.price_sale === null || !Number.isFinite(parsedData.price_sale) || parsedData.price_sale <= 0 || parsedData.price_sale > MAX_PRICE) {
      return {success: false, message: dictionary.msg.INVALID_AMOUNT_PRICE};
    }
    if (!parsedData.category_id) {
      return {success: false, message: 'La categoría es requerida'};
    }
    if (!parsedData.shelf_id) {
      return {success: false, message: 'La estantería es requerida'};
    }
    if (parsedData.quantity === null || !Number.isFinite(parsedData.quantity) || parsedData.quantity < 0) {
      return {success: false, message: 'La cantidad debe ser mayor o igual a 0'};
    }
    if (!parsedData.type_unity || parsedData.type_unity.trim() === '') {
      return {success: false, message: 'El tipo de unidad es requerido'};
    }

    const productData = {
      name: parsedData.name,
      price: Number(parsedData.price),
      price_sale: Number(parsedData.price_sale),
      category_id: Number(parsedData.category_id),
      shelf_id: Number(parsedData.shelf_id),
      quantity: Number(parsedData.quantity),
      type_unity: parsedData.type_unity,
      status: parsedData.status,
    };

    return saveProduct(productData, currentIsNew, id);
  };

  const handleInputChange = (name: string, value: string) => {
    setDataForm((prevData) => {
      let processedValue: string | number | boolean | null = value;

      if (name === 'status') {
        processedValue = value === 'true';
      } else if (name === 'price' || name === 'price_sale' || name === 'quantity') {
        processedValue = value === '' ? null : Number(value);
      } else if (name === 'category_id' || name === 'shelf_id') {
        processedValue = value === '' ? null : value;
      }

      return {
        ...prevData,
        [name]: processedValue,
      };
    });
  };

  const formFields = useMemo(() => [
    {
      group: [
        {
          name: 'name',
          label: 'Nombre',
          type: 'text',
          placeholder: 'Nombre del producto',
          value: dataForm.name,
          onChange: handleInputChange
        },
        {
          name: 'status',
          label: 'Estado',
          type: 'select',
          placeholder: 'Estado del producto',
          value: String(dataForm.status),
          onChange: handleInputChange,
          options: STATUS_OPTIONS
        },
      ]
    },
    {
      group: [
        {
          name: 'price',
          label: 'Precio de venta',
          type: 'number',
          placeholder: '0.00',
          value: dataForm.price ?? '',
          onChange: handleInputChange
        },
        {
          name: 'price_sale',
          label: 'Precio de compra',
          type: 'number',
          placeholder: '0.00',
          value: dataForm.price_sale ?? '',
          onChange: handleInputChange
        },
      ],
    },
    {
      group: [
        {
          name: 'shelf_id',
          label: 'Estantería',
          type: 'select',
          placeholder: 'Estantería del producto',
          value: dataForm.shelf_id ? String(dataForm.shelf_id) : '',
          onChange: handleInputChange,
          options: shelves,
          searchable: true,
          searchPlaceholder: 'Buscar estantería...',
          onSearch: searchShelves
        },
        {
          name: 'category_id',
          label: 'Categoría',
          type: 'select',
          placeholder: 'Categoría del producto',
          value: dataForm.category_id ? String(dataForm.category_id) : '',
          onChange: handleInputChange,
          options: categories,
          searchable: true,
          searchPlaceholder: 'Buscar categoría...',
          onSearch: searchCategories
        },
      ],
    },
    {
      group: [
        {
          name: 'quantity',
          label: 'Cantidad',
          type: 'number',
          placeholder: 'Cantidad en stock',
          value: dataForm.quantity ?? '',
          onChange: handleInputChange
        },
        {
          name: 'type_unity',
          label: 'Tipo de unidad',
          type: 'select',
          placeholder: 'Tipo de unidad del producto',
          value: dataForm.type_unity,
          onChange: handleInputChange,
          options: TYPE_UNITIES
        }
      ]
    }
  ], [dataForm, categories, shelves, searchCategories, searchShelves]);

  if (loadingData) {
    return (
      <div className="w-full mx-auto px-4 py-8 lg:py-20">
        <div className="flex items-center justify-center py-12">
          <div className="w-16 h-16">
            <Loader/>
          </div>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="w-full mx-auto px-4 py-8 lg:py-20">
        <Alert
          variant="error"
          title="Error cargando datos"
          message={dataError}
          showLink={false}
        />
      </div>
    );
  }

  return (
    <FormBase
      item={product ?? null}
      isNew={isNew}
      entityLabel="producto"
      redirectPath="/tienda/productos"
      sectionLabel="Datos del producto"
      onSaveAction={handleSubmit}
      formFields={formFields}
      dataForm={dataForm}
    />
  );
}
