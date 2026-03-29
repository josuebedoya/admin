import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import React from "react";
import {dictionary} from "@/dictionary";
import TableCategories from "@/components/store/tableCategories";
import getCategories from "@/server/store/categoryRepository/getCategories";
import {getPageSizeFromParams} from "@/server/utils/getPageSizeFromParams";

export const metadata: Metadata = {
  title: "Categorías - Admin",
  description:
    "Gestiona tus categorías de productos de manera eficiente con nuestra plataforma de administración. Agrega, edita y elimina categorías fácilmente, organiza tus productos de manera efectiva y mejora la experiencia de compra de tus clientes. Optimiza tu tienda en línea con nuestras herramientas de gestión de categorías.",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Categories({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = await getPageSizeFromParams(params);

  const {data: categories, error, message} = await getCategories({ page, pageSize });

  return (
    <div>
      <PageBreadcrumb pageTitle={dictionary.admin.store.categories.title}/>
      <div className="space-y-6">
        <ComponentCard title={dictionary.admin.store.categories.description}>
          {error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              {dictionary.msg[message as keyof typeof dictionary.msg] || 'Error al cargar las categorías'}
            </div>
          ) : (
            <TableCategories 
              items={categories.items || []}
              totalAmount={categories.count || 0}
              currentPage={page}
              pageSize={pageSize}
            />
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
