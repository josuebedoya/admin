import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { dictionary } from "@/dictionary";
import TableReports from "@/components/store/tableReports";
import getReports from "@/server/store/reportsRepository/getReports";

export const metadata: Metadata = {
  title: "Reportes - Admin",
  description:
    "Visualiza los reportes de tu tienda en el dashboard de reportes. Analiza las ventas, ganancias y otros datos clave para optimizar tu negocio con facilidad.",
};

type PageProps = {
  searchParams: Promise<{ [ key: string ]: string | string[] | undefined }>;
};

export default async function Reports({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;

  const { data: reports, error, message } = await getReports({ page, pageSize });

  return (
    <div>
      <PageBreadcrumb pageTitle={dictionary.admin.dashboard.reports.title} />
      <div className="space-y-6">
        <ComponentCard title={dictionary.admin.dashboard.reports.description}>
          {error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              {dictionary.msg[ message as keyof typeof dictionary.msg ] || 'Error al cargar los reportess'}
            </div>
          ) : (
            <TableReports
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
