import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import React from "react";
import {dictionary} from "@/dictionary";
import TableProducts from "@/components/store/tableProducts";
import getProducts from "@/server/store/getProducts";

export const metadata: Metadata = {
  title: "Productos - Admin",
  description:
    "Gestiona tus productos de manera eficiente con nuestra plataforma de administración. Agrega, edita y elimina productos fácilmente, mantén tu inventario actualizado y ofrece una experiencia de compra fluida a tus clientes. Optimiza tu tienda en línea con nuestras herramientas de gestión de productos.",
};

const {data: products, error, message} = await getProducts();

export default function Categories() {
  return (
    <div>
      <PageBreadcrumb pageTitle={dictionary.admin.store.categories.title}/>
      <div className="space-y-6">
        <ComponentCard title={dictionary.admin.store.categories.description}>
          {error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              {dictionary.msg[message as keyof typeof dictionary.msg] || 'Error al cargar los productos'}
            </div>
          ) : (
            <TableProducts items={products.items || []}/>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
