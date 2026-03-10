'use client';

import FormNameStatus from "./FormNameStatus";
import {saveCategory} from "@/server/actions/store";

type FormCategoryProps = {
  category?: { id: string | number; name: string; status: boolean } | null;
  isNew: boolean;
};

export default function CategoryForm({category, isNew}: FormCategoryProps) {
  return (
    <FormNameStatus
      item={category ?? null}
      isNew={isNew}
      entityLabel="categoría"
      redirectPath="/tienda/categorias"
      sectionLabel="Datos de la categoría"
      namePlaceholder="Nombre de la categoría"
      onSaveAction={(data, isNew, id) => saveCategory(data, isNew, id)}
    />
  );
}
