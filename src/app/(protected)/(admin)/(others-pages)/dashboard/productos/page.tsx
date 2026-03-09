import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { dictionary } from "@/dictionary";
import TableProducts from "@/components/store/tableProducts";
import getProducts from "@/server/store/getProducts";

export const metadata: Metadata = {
  title: "Dashboard productos - Admin",
  description:
    "Visualiza los produts, ganancias, ventas y más detalles de tu tienda en el dashboard de productos. Administra tu inventario y optimiza tus ventas con facilidad.",
};

type PageProps = {
  searchParams: Promise<{ [ key: string ]: string | string[] | undefined }>;
};

export default async function Productos({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;

  const { data: products, error, message } = await getProducts({ page, pageSize });

  return (
    <div>
      <PageBreadcrumb pageTitle={dictionary.admin.store.categories.title} />
      <div className="space-y-6">
        <ComponentCard title={dictionary.admin.store.categories.description}>
          {error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              {dictionary.msg[ message as keyof typeof dictionary.msg ] || 'Error al cargar los productos'}
            </div>
          ) : (
            <TableProducts
              items={products.items || []}
              totalAmount={products.count || 0}
              isDashboard
              currentPage={page}
              pageSize={pageSize}
              stickyLastRow
            />
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
