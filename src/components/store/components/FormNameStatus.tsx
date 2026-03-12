'use client';

import React, {useCallback, useMemo, useState} from "react";
import FormBase from "@/components/store/components/FormBase";

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
  const [dataForm, setDataForm] = useState({name: item?.name ?? '', status: item?.status ?? true});

  const handleInputChange = useCallback((name: string, value: string) => {
    setDataForm(prev => ({
      ...prev,
      [name]: name === 'status' ? value === 'true' : value,
    }));
  }, []);

  const handleSubmit = async (rawData: Record<string, string>, currentIsNew: boolean, id?: string | number) => {
    const name = (rawData.name ?? '').trim();
    const status = rawData.status === 'true';

    if (!name) {
      return {success: false, message: 'El nombre es requerido'};
    }

    return onSaveAction({name, status}, currentIsNew, id);
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
    <FormBase
      item={item}
      isNew={isNew}
      entityLabel={entityLabel}
      redirectPath={redirectPath}
      sectionLabel={sectionLabel}
      onSaveAction={handleSubmit}
      formFields={formFields}
      dataForm={dataForm}
    />
  );
}
