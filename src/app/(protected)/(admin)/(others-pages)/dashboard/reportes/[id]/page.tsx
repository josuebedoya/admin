import FormProduct from "@/components/store/formProduct";
import Alert from "@/components/ui/alert/Alert";
import { dictionary } from "@/dictionary";
import { getReportById } from "@/server/store/reportsRepository";

type PageProps = {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === '%2B' || id === '+';

  if (isNew) {
    return <FormProduct product={null} isNew={true} />;
  }

  const { data: product, message, success } = await getReportById({ id });

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

  if (!product) {
    return (
      <Alert
        title={`El reporte con ID ${id} no fue encontrado`}
        message={dictionary.msg[ message as keyof typeof dictionary.msg || 'PRODUCT_NOT_FOUND' ]}
        variant="warning"
        key='not-found'
      />
    );
  }

  return `Report ${id} - Detalles del reporte aún no implementados.`;
}