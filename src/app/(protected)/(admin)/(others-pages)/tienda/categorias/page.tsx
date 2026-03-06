import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import React from "react";
import {dictionary} from "@/dictionary";
import TableCategories from "@/components/store/tableCategories";

export const metadata: Metadata = {
  title: "Categorías - Admin",
  description:
    "Gestiona tus categorías de productos de manera eficiente con nuestra plataforma de administración. Agrega, edita y elimina categorías fácilmente, organiza tus productos de manera efectiva y mejora la experiencia de compra de tus clientes. Optimiza tu tienda en línea con nuestras herramientas de gestión de categorías.",
  // other metadata
};

const itemCategory = {
  id: '1',
  name: 'Categoría 1',
  status: 'active',
  products: 10,
}

const items = Array(10).fill(itemCategory);

export default function Categories() {
  return (
    <div>
      <PageBreadcrumb pageTitle={dictionary.admin.store.categories.title}/>
      <div className="space-y-6">
        <ComponentCard title={dictionary.admin.store.categories.description}>
          <TableCategories items={items}/>
        </ComponentCard>
      </div>
    </div>
  );
}
