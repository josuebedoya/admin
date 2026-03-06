import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import React from "react";
import {dictionary} from "@/dictionary";
import TableProducts from "@/components/store/tableProducts";

export const metadata: Metadata = {
  title: "Productos - Admin",
  description:
    "Gestiona tus productos de manera eficiente con nuestra plataforma de administración. Agrega, edita y elimina productos fácilmente, mantén tu inventario actualizado y ofrece una experiencia de compra fluida a tus clientes. Optimiza tu tienda en línea con nuestras herramientas de gestión de productos.",
  // other metadata
};

const itemCategory = {
  id: '1',
  name: 'Producto 1',
  status: 'active',
  quantity: 10,
  category: 'Categoria 1',
  price: 120000,
  category_id: 1
}

const items = Array(10).fill(itemCategory);

export default function Categories() {
  return (
    <div>
      <PageBreadcrumb pageTitle={dictionary.admin.store.categories.title}/>
      <div className="space-y-6">
        <ComponentCard title={dictionary.admin.store.categories.description}>
          <TableProducts items={items}/>
        </ComponentCard>
      </div>
    </div>
  );
}
