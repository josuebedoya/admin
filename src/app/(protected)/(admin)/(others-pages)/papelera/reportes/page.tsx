import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import {dictionary} from "@/dictionary";
import {getReports} from "@/server/store/reportsRepository";
import TableDeletedReports from "@/components/wastebasket/tableDeletedReports";
import { requireAdmin } from "@/server/auth/requireAdmin";
import {getPageSizeFromParams} from "@/server/utils/getPageSizeFromParams";

export const metadata: Metadata = {
  title: "Reportes eliminados - Admin",
  description: "Administra los reportes eliminados en la papelera de reciclaje. Restaura los reportes según sea necesario.",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function TrashProducts({searchParams}: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = await getPageSizeFromParams(params);

  const {data: reports, error, message} = await getReports({page, pageSize, getDeleted: true});

  return (
    <div>
      <PageBreadcrumb pageTitle={dictionary.admin.wastebasket.reports.title}/>
      <div className="space-y-6">
        <ComponentCard title={dictionary.admin.wastebasket.reports.description}>
          {error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              {dictionary.msg[message as keyof typeof dictionary.msg] || 'Error al cargar los productos'}
            </div>
          ) : (
            <TableDeletedReports
              items={reports.items || []}
              totalAmount={reports.count || 0}
              currentPage={page}
              pageSize={pageSize}
            />
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
