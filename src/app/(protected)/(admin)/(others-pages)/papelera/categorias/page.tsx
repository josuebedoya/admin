import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import {dictionary} from "@/dictionary";
import TableDeletedCategory from "@/components/wastebasket/tableDeletedCategories";
import {getCategories} from "@/server/store/categoryRepository";
import { requireAdmin } from "@/server/auth/requireAdmin";

export const metadata: Metadata = {
  title: "Categorías Eliminadas - Admin",
  description: "Administra las categorías eliminadas en la papelera de reciclaje. Restaura las categorías según sea necesario.",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function TrashProducts({searchParams}: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;

  const {data: categories, error, message} = await getCategories({page, pageSize, getDeleted: true});

  return (
    <div>
      <PageBreadcrumb pageTitle={dictionary.admin.wastebasket.categories.title}/>
      <div className="space-y-6">
        <ComponentCard title={dictionary.admin.wastebasket.categories.description}>
          {error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              {dictionary.msg[message as keyof typeof dictionary.msg] || 'Error al cargar los productos'}
            </div>
          ) : (
            <TableDeletedCategory
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
