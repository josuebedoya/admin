import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import {dictionary} from "@/dictionary";
import getProducts from "@/server/store/productRepository/getProducts";
import TableDeletedProducts from "@/components/wastebasket/tableDeletedProducts";

export const metadata: Metadata = {
  title: "Productos - Admin",
  description:
    "Gestiona tus productos de manera eficiente con nuestra plataforma de administración. Agrega, edita y elimina productos fácilmente, mantén tu inventario actualizado y ofrece una experiencia de compra fluida a tus clientes. Optimiza tu tienda en línea con nuestras herramientas de gestión de productos.",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Productos({searchParams}: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;

  const {data: products, error, message} = await getProducts({page, pageSize, getDeleted: true});

  return (
    <div>
      <PageBreadcrumb pageTitle={dictionary.admin.wastebasket.products.title}/>
      <div className="space-y-6">
        <ComponentCard title={dictionary.admin.wastebasket.products.description}>
          {error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              {dictionary.msg[message as keyof typeof dictionary.msg] || 'Error al cargar los productos'}
            </div>
          ) : (
            <TableDeletedProducts
              items={products.items || []}
              totalAmount={products.count || 0}
              currentPage={page}
              pageSize={pageSize}
            />
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
