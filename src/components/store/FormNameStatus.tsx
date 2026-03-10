'use client';

import Button from "@/components/ui/button/Button";
import React, {useCallback, useMemo, useState} from "react";
import {dictionary} from "@/dictionary";
import Loader from '@/icons/loader.svg';
import Alert from "@/components/ui/alert/Alert";
import RenderFields from "./renderFields";
import {useRouter} from "next/navigation";

const STATUS_OPTIONS = [
  {value: 'true', label: 'Activo'},
  {value: 'false', label: 'Inactivo'},
];

type Item = {
  id: string | number;
  name: string;
  status: boolean;
} | null;

type FormNameStatusProps = {
  item: Item;
  isNew: boolean;
  entityLabel: string;
  redirectPath: string;
  sectionLabel: string;
  namePlaceholder: string;
  onSaveAction: (data: { name: string; status: boolean }, isNew: boolean, id?: string | number) => Promise<{
    success: boolean;
    message?: string | null;
  }>;
};

export default function FormNameStatus(
  {
    item,
    isNew,
    entityLabel,
    redirectPath,
    sectionLabel,
    namePlaceholder,
    onSaveAction,
  }: FormNameStatusProps) {
  const router = useRouter();

  const [dataForm, setDataForm] = useState({name: item?.name ?? '', status: item?.status ?? true});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = useCallback((name: string, value: string) => {
    setDataForm(prev => ({
      ...prev,
      [name]: name === 'status' ? value === 'true' : value,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setSuccessMessage('');

    if (!dataForm.name.trim()) {
      setMessage('El nombre es requerido');
      return;
    }

    setLoading(true);

    try {
      const result = await onSaveAction(
        {name: dataForm.name.trim(), status: dataForm.status},
        isNew,
        item?.id
      );

      if (!result.success) {
        setMessage(result.message || `Error al guardar ${entityLabel}`);
        setLoading(false);
        return;
      }

      setSuccessMessage(isNew ? `${entityLabel} creada exitosamente` : `${entityLabel} actualizada exitosamente`);
      window.scrollTo({top: 0, behavior: 'smooth'});

      setTimeout(() => router.push(redirectPath), 1500);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Error al guardar ${entityLabel}`);
      setLoading(false);
    }
  };

  const formFields = useMemo(() => [
    {
      group: [
        {
          name: 'name',
          label: 'Nombre',
          type: 'text',
          placeholder: namePlaceholder,
          value: dataForm.name,
          onChange: handleInputChange,
        },
        {
          name: 'status',
          label: 'Estado',
          type: 'select',
          placeholder: 'Selecciona el estado',
          value: String(dataForm.status),
          onChange: handleInputChange,
          options: STATUS_OPTIONS,
        },
      ],
    },
  ], [dataForm, namePlaceholder, handleInputChange]);

  return (
    <div className="w-full mx-auto px-4 py-8 lg:py-20">
      <div className="my-10">
        {message && (
          <Alert variant="error" title="Error" message={message} showLink={false}/>
        )}
        {successMessage && (
          <Alert variant="success" title="Éxito" message={successMessage} showLink={false}/>
        )}

        <div>
          <h1 className="text-2xl font-bold text-center mb-2">
            {isNew ? `Crear ${entityLabel}` : `Editar ${entityLabel}: ${item?.name || ''}`}
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            {isNew
              ? `Complete el formulario para crear una nueva ${entityLabel}.`
              : `Actualice los campos necesarios para editar ${entityLabel}.`}
          </p>
        </div>

        <div className="relative py-3 sm:py-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"/>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="p-2 text-gray-400 bg-gray-50 dark:bg-gray-900 sm:px-5 sm:py-2">
              {sectionLabel}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="space-y-6">
            <RenderFields fields={formFields}/>
            <div>
              <Button size="md">
                {dictionary.btn[isNew ? 'create' : 'save']}
              </Button>
            </div>
          </div>
          {loading && (
            <div
              className="loader absolute inset-0 bg-white/80 w-[110%] h-[110%] shadow-lg rounded-xl -left-[5%] -top-[5%] flex items-center justify-center">
              <div className="w-32 h-32"><Loader/></div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

