import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import {dictionary} from "@/dictionary";
import getShelves from "@/server/store/getShelves";
import TableShelves from "@/components/store/tableShelves";

export const metadata: Metadata = {
  title: "Estanterías - Admin",
  description:
    "Gestiona tus estanterías de productos de manera eficiente con nuestra plataforma de administración. Agrega, edita y elimina estanterías fácilmente, organiza tus productos de manera efectiva y mejora la experiencia de compra de tus clientes. Optimiza tu tienda en línea con nuestras herramientas de gestión de estanterías.",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Shelfies({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;

  const {data: shelves, error, message} = await getShelves({ page, pageSize });

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
            <TableShelves 
              items={shelves.items || []}
              totalAmount={shelves.count || 0}
              currentPage={page}
              pageSize={pageSize}
            />
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
