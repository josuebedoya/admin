'use client';

import {useCallback, useEffect, useMemo, useState} from "react";
import Loader from '@/icons/loader.svg';
import Alert from "@/components/ui/alert/Alert";
import FormBase from "@/components/store/components/FormBase";
import {User} from "@/server/auth/getUsers";
import {fetchRoles, saveUser} from "@/server/auth/actions";

type FormFields = User;

type FormProductProps = {
  user: User;
};

export default function ProfileForm({user}: FormProductProps) {
  const toSelectOptions = useCallback((items: Array<{ id: string | number; name: string }>) => {
    return items.map((item) => ({
      value: String(item.id),
      label: item.name,
    }));
  }, []);

  const [dataForm, setDataForm] = useState<FormFields>({
    id: user?.id,
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role_id: user?.role_id,
    role: user?.role ?? null,
  });

  const [roles, setRoles] = useState<{ value: string | number; label: string }[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [rolesRes] = await Promise.all([
          fetchRoles(1, 100)
        ]);

        setRoles(toSelectOptions(rolesRes.items));
      } catch (error) {
        setDataError(error instanceof Error ? error.message : 'Error cargando datos');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [toSelectOptions]);

  const searchRoles = useCallback(async (query: string) => {
    const result = await fetchRoles(1, 100, undefined, undefined, query || undefined);
    return toSelectOptions(result.items);
  }, [toSelectOptions]);

  const handleSubmit = async (rawData: Record<string, string>, currentIsNew: boolean, id?: string | number) => {
    const parsedData: FormFields = {
      name: (rawData.name ?? '').trim(),
      email: rawData.email ?? '',
      phone: rawData.phone ?? '',
      role_id: Number(rawData.role_id),
      role: user?.role ?? null,
      id: String(id),
    };

    if (!parsedData.name) {
      return {success: false, message: 'El nombre es requerido'};
    }
    if (parsedData.name.length > 255) {
      return {success: false, message: 'El nombre no puede exceder los 255 caracteres'};
    }
    // if (parsedData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsedData.email)) {
    //   return {success: false, message: 'El correo electrónico no es válido'};
    // }
    if (parsedData.phone && !/^\+?[0-9\s\-()]{7,}$/.test(parsedData.phone)) {
      return {success: false, message: 'El número de teléfono no es válido'};
    }
    if (parsedData.role_id && isNaN(parsedData.role_id)) {
      return {success: false, message: 'El rol seleccionado no es válido'};
    }

    const User = {
      name: parsedData.name,
      // email: parsedData.email,
      phone: parsedData.phone,
      role_id: parsedData.role_id,
      id: parsedData.id,
    };

    return saveUser(User, id);
  };

  const handleInputChange = (name: string, value: string) => {
    setDataForm((prevData) => {
      let processedValue: string | number | boolean | null = value;

      if (name === 'role_id') {
        processedValue = value === '' ? null : value;
      }

      return {
        ...prevData,
        [name]: processedValue,
      };
    });
  };

  console.log(dataForm)

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
        }, {
          name: 'email',
          label: 'Correo electrónico',
          type: 'email',
          placeholder: 'email@example.com',
          value: dataForm.email ?? '',
          onChange: handleInputChange,
          readonly: true,
        },

      ]
    },
    {
      group: [
        {
          name: 'phone',
          label: 'Teléfono',
          type: 'text',
          placeholder: 'Número de teléfono',
          value: dataForm.phone ?? '',
          onChange: handleInputChange,
        },
        {
          name: 'role_id',
          label: 'Rol',
          type: 'select',
          placeholder: 'Rol del usuario',
          value: dataForm.role_id ?? '',
          onChange: handleInputChange,
          options: roles,
          onSearch: searchRoles,

        }
      ],
    },
  ], [dataForm, roles, searchRoles]);

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
      item={user ?? null}
      isNew={false}
      entityLabel="Usuario"
      redirectPath="/usuarios"
      sectionLabel="Datos del Usuario"
      onSaveAction={handleSubmit}
      formFields={formFields}
      dataForm={dataForm}
    />
  );
}
