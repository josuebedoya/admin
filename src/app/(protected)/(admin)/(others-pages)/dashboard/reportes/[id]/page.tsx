import ComponentCard from "@/components/common/ComponentCard";
import ReportProductsTable from "@/components/store/ReportProductsTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Alert from "@/components/ui/alert/Alert";
import { dictionary } from "@/dictionary";
import { getProductSnapshotById } from "@/server/store/productSnapshotRepository";
import { getReportById } from "@/server/store/reportsRepository";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [ key: string ]: string | string[] | undefined }>;
}

export default async function ReportPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const searchParamsResult = await searchParams;

  if (!(!!Number(id))) {
    return (
      <Alert
        title='Error cargando reporte'
        message='Este reporte no existe'
        variant="error"
        key='errror'
      />
    );
  }

  const { data: report, message, success, error } = await getReportById({ id });
  const { data: products, message: messageProducts, success: successProducts } = await getProductSnapshotById({ id });

  const page = Number(searchParamsResult.page) || 1;
  const pageSize = Number(searchParamsResult.pageSize) || 10;


  if (!success) {
    return (
      <Alert
        title='Error cargando reporte'
        message={dictionary.msg[ message as keyof typeof dictionary.msg ] || 'No se pudo cargar el reporte. Intente nuevamente.'}
        variant="error"
        key='errror'
      />
    );
  }

  if (!report) {
    return (
      <Alert
        title={`El reporte con ID ${id} no fue encontrado`}
        message={dictionary.msg[ message as keyof typeof dictionary.msg || 'DATA_NOT_FOUND' ]}
        variant="warning"
        key='not-found'
      />
    );
  }

  if (!successProducts) {
    return (
      <Alert
        title='Error cargando productos del reporte'
        message={dictionary.msg[ messageProducts as keyof typeof dictionary.msg ] || 'No se pudieron cargar los productos del reporte. Intente nuevamente.'}
        variant="error"
        key='errror-products'
      />
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle={`Reporte ${report.id}`} />
      <div className="space-y-6">
        <ComponentCard title={dictionary.admin.dashboard.reports.description}>
          {error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              {dictionary.msg[ message as keyof typeof dictionary.msg ] || 'Error al cargar los reportess'}
            </div>
          ) : (
            <ReportProductsTable
              reportId={id}
              items={products?.items || []}
              totalAmount={products?.count || 0}
              currentPage={page}
              pageSize={pageSize}
              keyCache={`report-${id}-products`}
            />
          )}
        </ComponentCard>
      </div>
    </div>
  );
}