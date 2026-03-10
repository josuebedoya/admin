'use client';

import Button from "@/components/ui/button/Button";
import React, {useMemo, useState} from "react";
import {dictionary} from "@/dictionary";
import Loader from '@/icons/loader.svg';
import Alert from "@/components/ui/alert/Alert";
import RenderFields from "./renderFields";
import {saveDailySale} from "@/server/actions/store";
import {useRouter} from "next/navigation";

type FormFields = {
  transferred: number | null;
  cashed: number | null;
  note: string;
};

type FormDailySaleProps = {
  dailySale?: {
    id: string | number;
    transferred: number;
    cashed: number;
    note: string;
    date_created: string;
  } | null;
  isNew: boolean;
};

export default function DailySaleForm({dailySale, isNew}: FormDailySaleProps) {
  const router = useRouter();

  const [dataForm, setDataForm] = useState<FormFields>({
    transferred: dailySale ? dailySale.transferred : null,
    cashed: dailySale ? dailySale.cashed : null,
    note: dailySale ? String(dailySale.note) : "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setSuccessMessage('');

    if ((!dataForm.transferred || dataForm.transferred <= 0) && (!dataForm.cashed || dataForm.cashed <= 0)) {
      setMessage('Debe ingresar un monto válido en Transferido o Efectivo');
      return;
    }

    setLoading(true);

    try {
      const saleData = {
        transferred: Number(dataForm.transferred),
        cashed: Number(dataForm.cashed),
        note: dataForm.note || ''
      };

      const result = await saveDailySale(saleData, isNew, dailySale?.id);

      if (!result.success) {
        setMessage(result.message || 'Error al guardar la venta diaria');
        setLoading(false);
        return;
      }

      setSuccessMessage(isNew ? 'Venta registrada exitosamente' : 'Venta actualizada exitosamente');
      window.scrollTo({top: 0, behavior: 'smooth'});

      setTimeout(() => {
        router.push('/dashboard/ventas-diarias');
      }, 1500);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error al guardar la venta');
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setDataForm((prevData) => {
      let processedValue: any = value;

      if (name === 'transferred' || name === 'cashed') {
        processedValue = value === '' ? null : Number(value);
      } else {
        processedValue = value;
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
          name: 'transferred',
          label: 'Transferido',
          type: 'number',
          placeholder: '0.00',
          value: dataForm.transferred ?? '',
          onChange: handleInputChange
        },
        {
          name: 'cashed',
          label: 'Efectivo',
          type: 'number',
          placeholder: '0.00',
          value: dataForm.cashed ?? '',
          onChange: handleInputChange
        },
      ]
    },
    {
      group: [
        {
          name: 'note',
          label: 'Nota',
          type: 'textarea',
          placeholder: 'Nota opcional',
          value: dataForm.note,
          onChange: handleInputChange
        }
      ]
    }
  ], [dataForm]);

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
            {isNew ? 'Registrar Venta Diaria' : `Editar Venta: ${dailySale?.id || ''}`}
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            {isNew
              ? 'Ingrese los montos de la venta del día.'
              : 'Actualice los valores de la venta.'}
          </p>
        </div>

        <div className="relative py-3 sm:py-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="p-2 text-gray-400 bg-gray-50 dark:bg-gray-900 sm:px-5 sm:py-2">
              Detalles de Venta
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
