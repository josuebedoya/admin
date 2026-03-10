'use client';

import Button from "@/components/ui/button/Button";
import React, { useMemo, useState } from "react";import { dictionary } from "@/dictionary";
import Loader from '@/icons/loader.svg';
import Alert from "@/components/ui/alert/Alert";
import RenderFields from "./renderFields";
import { saveCategory } from "@/server/actions/store";
import { useRouter } from "next/navigation";
import { STATUS_OPTIONS } from "@/components/store/resources";


type FormFields = {
  name: string;
  status: boolean;
}

type FormCategoryProps = {
  category?: {
    id: string | number;
    name: string;
    status: boolean;
  } | null;
  isNew: boolean;
};

export default function CategoryForm({ category, isNew }: FormCategoryProps) {
  const router = useRouter();
  const [dataForm, setDataForm] = useState<FormFields>({
    name: category ? category.name : "",
    status: category ? category.status : true,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setSuccessMessage('');

    if (!dataForm.name || dataForm.name.trim() === '') {
      setMessage('El nombre es requerido');
      return;
    }

    setLoading(true);

    try {
      const categoryData = {
        name: dataForm.name.trim(),
        status: dataForm.status,
      };

      const result = await saveCategory(categoryData, isNew, category?.id);

      if (!result.success) {
        setMessage(result.message || 'Error al guardar la categoría');
        setLoading(false);
        return;
      }

      setSuccessMessage(isNew ? 'Categoría creada exitosamente' : 'Categoría actualizada exitosamente');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        router.push('/tienda/categorias');
      }, 1500);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error al guardar la categoría');
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setDataForm((prevData) => {
      let processedValue: any = value;
      if (name === 'status') {
        processedValue = value === 'true';
      }
      return { ...prevData, [name]: processedValue };
    });
  };

  const formFields = useMemo(() => [
    {
      group: [
        {
          name: 'name',
          label: 'Nombre',
          type: 'text',
          placeholder: 'Nombre de la categoría',
          value: dataForm.name,
          onChange: handleInputChange
        },
        {
          name: 'status',
          label: 'Estado',
          type: 'select',
          placeholder: 'Estado de la categoría',
          value: String(dataForm.status),
          onChange: handleInputChange,
          options: STATUS_OPTIONS
        },
      ]
    },
  ], [dataForm]);

  return (
    <div className="w-full mx-auto px-4 py-8 lg:py-20">
      <div className="my-10">
        {message && (
          <Alert variant="error" title="Error" message={message} showLink={false} />
        )}
        {successMessage && (
          <Alert variant="success" title="Éxito" message={successMessage} showLink={false} />
        )}

        <div>
          <h1 className="text-2xl font-bold text-center mb-2">
            {isNew ? 'Crear categoría' : `Editar categoría: ${category?.name || ''}`}
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            {isNew
              ? 'Complete el formulario para crear una nueva categoría.'
              : 'Actualice los campos necesarios para editar la categoría.'}
          </p>
        </div>

        <div className="relative py-3 sm:py-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="p-2 text-gray-400 bg-gray-50 dark:bg-gray-900 sm:px-5 sm:py-2">
              Datos de la categoría
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="space-y-6">
            <RenderFields fields={formFields} />
            <div>
              <Button size="md">
                {dictionary.btn[isNew ? 'create' : 'save']}
              </Button>
            </div>
          </div>
          {loading && (
            <div className="loader absolute inset-0 bg-white/80 w-[110%] h-[110%] shadow-lg rounded-xl -left-[5%] -top-[5%] flex items-center justify-center">
              <div className="w-32 h-32"><Loader /></div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
