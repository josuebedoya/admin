import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableProducts from "@/components/store/tableProducts";
import getProducts from "@/server/store/productRepository/getProducts";
import { getPageSizeFromParams } from "@/server/utils/getPageSizeFromParams";

export const metadata: Metadata = {
  title: "Almacén - Admin",
  description: "Productos inactivos en el almacén.",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductosAlmacen({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = await getPageSizeFromParams(params);

  const { data: products, error, message } = await getProducts({ page, pageSize, eq: { status: false } });

  return (
    <div>
      <PageBreadcrumb pageTitle="Almacén - Productos inactivos" />
      <div className="space-y-6">
        <ComponentCard title="Productos inactivos">
          {error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              {message || 'Error al cargar los productos'}
            </div>
          ) : (
            <TableProducts
              items={products.items || []}
              totalAmount={products.count || 0}
              currentPage={page}
              pageSize={pageSize}
              mode="inactive"
              keyCache="products-almacen"
            />
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
