import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import {dictionary} from "@/dictionary";
import {getShelves} from "@/server/store/shelveRepository";
import TableDeletedShelves from "@/components/wastebasket/tableDeletedShelves";

export const metadata: Metadata = {
  title: "Estanterías Eliminadas - Admin",
  description: "Administra las estanterías eliminadas en la papelera de reciclaje. Restaura las estanterías según sea necesario.",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PageShelves({searchParams}: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;

  const {data: shelves, error, message} = await getShelves({page, pageSize, getDeleted: true});

  return (
    <div>
      <PageBreadcrumb pageTitle={dictionary.admin.wastebasket.shelves.title}/>
      <div className="space-y-6">
        <ComponentCard title={dictionary.admin.wastebasket.shelves.description}>
          {error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              {dictionary.msg[message as keyof typeof dictionary.msg] || 'Error al cargar los productos'}
            </div>
          ) : (
            <TableDeletedShelves
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
