import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import React from "react";
import {dictionary} from "@/dictionary";
import TableCategories from "@/components/store/tableCategories";
import getShelves from "@/server/store/getShelves";

export const metadata: Metadata = {
  title: "Categorías - Admin",
  description:
    "Gestiona tus categorías de productos de manera eficiente con nuestra plataforma de administración. Agrega, edita y elimina categorías fácilmente, organiza tus productos de manera efectiva y mejora la experiencia de compra de tus clientes. Optimiza tu tienda en línea con nuestras herramientas de gestión de categorías.",
};

export default async function Shelfies() {
  const {data: shelves, error, message} = await getShelves();

  return (
    <div>
      <PageBreadcrumb pageTitle={dictionary.admin.store.shelfies.title}/>
      <div className="space-y-6">
        <ComponentCard title={dictionary.admin.store.shelfies.description}>
          {error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              {dictionary.msg[message as keyof typeof dictionary.msg] || 'Error al cargar las estanterias'}
            </div>
          ) : (
            <TableCategories items={shelves.items || []}/>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
