'use client';

import FormNameStatus from "./components/FormNameStatus";
import {saveShelve} from "@/server/actions/store";

type FormShelfProps = {
  shelf?: { id: string | number; name: string; status: boolean } | null;
  isNew: boolean;
};

export default function ShelfForm({shelf, isNew}: FormShelfProps) {
  return (
    <FormNameStatus
      item={shelf ?? null}
      isNew={isNew}
      entityLabel="estantería"
      redirectPath="/tienda/estanterias"
      sectionLabel="Datos de la estantería"
      namePlaceholder="Nombre de la estantería"
      onSaveAction={(data, isNew, id) => saveShelve(data, isNew, id)}
    />
  );
}

