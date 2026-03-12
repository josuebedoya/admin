'use client';

import React, {useMemo, useState} from "react";
import {saveDailySale} from "@/server/actions/store";
import FormBase from "@/components/store/components/FormBase";
import {dictionary} from "@/dictionary";
import {MAX_PRICE} from "@/components/store/resources";

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

  const [dataForm, setDataForm] = useState<FormFields>({
    transferred: dailySale ? dailySale.transferred : 0,
    cashed: dailySale ? dailySale.cashed : 0,
    note: dailySale ? String(dailySale.note) : "",
  });

  const handleSubmit = async (rawData: Record<string, string>, isNew: boolean, id?: string | number) => {
    const data: FormFields = {
      transferred: rawData.transferred === '' || rawData.transferred == null ? null : Number(rawData.transferred),
      cashed: rawData.cashed === '' || rawData.cashed == null ? null : Number(rawData.cashed),
      note: rawData.note ?? '',
    };

    const isTransferredInvalid =
      data.transferred !== null && (!Number.isFinite(data.transferred) || data.transferred <= 0 || data.transferred > MAX_PRICE);
    const isCashedInvalid =
      data.cashed !== null && (!Number.isFinite(data.cashed) || data.cashed <= 0 || data.cashed > MAX_PRICE);

    const hasTransferredValid = data.transferred !== null && !isTransferredInvalid;
    const hasCashedValid = data.cashed !== null && !isCashedInvalid;

    if (!hasTransferredValid && !hasCashedValid) {
      return {success: false, message: dictionary.msg.INVALID_AMOUNT_PRICE};
    }

    const saleData = {
      transferred: Number(data.transferred ?? 0),
      cashed: Number(data.cashed ?? 0),
      note: data.note || ''
    };

    return await saveDailySale(saleData, isNew, id);
  };

  const handleInputChange = (name: string, value: string) => {
    setDataForm((prevData) => {
      let processedValue: string | number | null;

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
    <FormBase
      item={dailySale ?? null}
      isNew={isNew}
      entityLabel="Venta Diaria"
      redirectPath="/dashboard/ventas-diarias"
      sectionLabel="Datos de la venta"
      onSaveAction={handleSubmit}
      formFields={formFields}
      dataForm={dataForm}
    />
  );
}
