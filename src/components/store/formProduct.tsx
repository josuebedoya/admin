'use client';

import Button from "@/components/ui/button/Button";
import React, { useState, useMemo, useEffect } from "react";
import { dictionary } from "@/dictionary";
import Loader from '@/icons/loader.svg';
import Alert from "@/components/ui/alert/Alert";
import RenderFields from "./renderFields";
import { fetchCategories, fetchShelves, saveProduct } from "@/server/actions/store";
import { useRouter } from "next/navigation";

const TYPE_UNITIES = [
  { value: 'unity', label: 'Unidad' },
  { value: 'kl', label: 'Kilogramo' },
  { value: 'lt', label: 'Litro' },
  { value: 'six_pack', label: 'Six Pack' },
  { value: 'box', label: 'Caja' },
  { value: 'dozen', label: 'Docena' }
];

const STATUS_OPTIONS = [
  { value: 'true', label: 'Activo' },
  { value: 'false', label: 'Inactivo' }
];

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

export default function ProductForm({ product, isNew }: FormProductProps) {
  const router = useRouter();
  const [ dataForm, setDataForm ] = useState<FormFields>({
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

  const [ loading, setLoading ] = useState<boolean>(false);
  const [ message, setMessage ] = useState<string>('');
  const [ successMessage, setSuccessMessage ] = useState<string>('');
  const [ categories, setCategories ] = useState<{ value: string | number; label: string }[]>([]);
  const [ shelves, setShelves ] = useState<{ value: string | number; label: string }[]>([]);
  const [ loadingData, setLoadingData ] = useState<boolean>(true);
  const [ dataError, setDataError ] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [ categoriesResult, shelvesResult ] = await Promise.all([
          fetchCategories(1, 100),
          fetchShelves(1, 100)
        ]);

        const formattedCategories = categoriesResult.items.map((category: any) => ({
          value: String(category.id),
          label: category.name
        }));

        const formattedShelves = shelvesResult.items.map((shelf: any) => ({
          value: String(shelf.id),
          label: shelf.name
        }));

        setCategories(formattedCategories);
        setShelves(formattedShelves);
      } catch (error) {
        setDataError(error instanceof Error ? error.message : 'Error cargando datos');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setSuccessMessage('');

    // Validar campos requeridos
    if (!dataForm.name || dataForm.name.trim() === '') {
      setMessage('El nombre es requerido');
      return;
    }
    if (!dataForm.price || dataForm.price <= 0) {
      setMessage('El precio debe ser mayor a 0');
      return;
    }
    if (!dataForm.price_sale || dataForm.price_sale <= 0) {
      setMessage('El precio de venta debe ser mayor a 0');
      return;
    }
    if (!dataForm.category_id) {
      setMessage('La categoría es requerida');
      return;
    }
    if (!dataForm.shelf_id) {
      setMessage('La estantería es requerida');
      return;
    }
    if (dataForm.quantity === null || dataForm.quantity < 0) {
      setMessage('La cantidad debe ser mayor o igual a 0');
      return;
    }
    if (!dataForm.type_unity || dataForm.type_unity.trim() === '') {
      setMessage('El tipo de unidad es requerido');
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para guardar - asegurar tipos correctos
      const productData = {
        name: dataForm.name,
        price: Number(dataForm.price),
        price_sale: Number(dataForm.price_sale),
        category_id: Number(dataForm.category_id),
        shelf_id: Number(dataForm.shelf_id),
        quantity: Number(dataForm.quantity),
        type_unity: dataForm.type_unity,
        status: dataForm.status,
      };

      console.log('Saving product:', { productData, isNew, productId: product?.id });

      const result = await saveProduct(productData, isNew, product?.id);

      if (!result.success) {
        setMessage(result.message || 'Error al guardar el producto');
        setLoading(false);
        return;
      }

      setSuccessMessage(isNew ? 'Producto creado exitosamente' : 'Producto actualizado exitosamente');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Redirigir después de un breve delay para mostrar el mensaje
      setTimeout(() => {
        router.push('/tienda/productos');
      }, 1500);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error al guardar el producto');
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setDataForm((prevData) => {
      // Convertir el valor según el tipo de campo
      let processedValue: any = value;

      if (name === 'status') {
        processedValue = value === 'true';
      } else if (name === 'price' || name === 'price_sale' || name === 'quantity') {
        processedValue = value === '' ? null : Number(value);
      } else if (name === 'category_id' || name === 'shelf_id') {
        processedValue = value === '' ? null : value;
      }

      return {
        ...prevData,
        [ name ]: processedValue,
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
          options: shelves
        },
        {
          name: 'category_id',
          label: 'Categoría',
          type: 'select',
          placeholder: 'Categoría del producto',
          value: dataForm.category_id ? String(dataForm.category_id) : '',
          onChange: handleInputChange,
          options: categories
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
  ], [ dataForm, categories, shelves ]);

  return (
    <div className="w-full max-wxl mx-auto px-4 py-8 lg:py-20">
      <div>
        <div className="my-10">
          {dataError && (
            <Alert
              variant="error"
              title="Error cargando datos"
              message={dataError}
              showLink={false}
            />
          )}
          {message && (
            <Alert
              variant="error"
              title="Error"
              message={message}
              showLink={false}
            />
          )}
          {successMessage && (
            <Alert
              variant="success"
              title="Éxito"
              message={successMessage}
              showLink={false}
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-center mb-2">
              {isNew ? 'Crear nuevo producto' : `Editar producto: ${product?.name || ''}`}
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              {isNew ? 'Complete el formulario para crear un nuevo producto.' : 'Actualice los campos necesarios para editar el producto.'}
            </p>
          </div>
          <div className="relative py-3 sm:py-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="p-2 text-gray-400 bg-gray-50 dark:bg-gray-900 sm:px-5 sm:py-2">
                Aquí
              </span>
            </div>
          </div>
          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-16 h-16">
                <Loader />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='relative'>
              <div className="space-y-6">
                <RenderFields fields={formFields} />

                <div>
                  <Button size="md">
                    {dictionary.btn[ product ? 'save' : 'create' ]}
                  </Button>
                </div>
              </div>
              {loading && (
                <div
                  className="loader absolute inset-0 bg-white/80 w-[110%] h-[110%] shadow-lg rounded-xl -left-[5%] -top-[5%] flex items-center justify-center">
                  <div className="w-32 h-32">
                    <Loader />
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div >
    </div >
  );
}
