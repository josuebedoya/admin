import DailySaleForm from "@/components/store/formDailySale";
import Alert from "@/components/ui/alert/Alert";
import {dictionary} from "@/dictionary";
import {getDailySaleById} from "@/server/store/dailySaleRepository";

type PageProps = {
  params: Promise<{ id: string }>;

};

export default async function SalePage({params}: PageProps) {
  const {id} = await params;
  const isNew = id === '%2B' || id === '+';

  if (isNew) {
    return <DailySaleForm dailySale={null} isNew={true}/>;
  }

  const {data: sale, message, success} = await getDailySaleById({id});

  if (!success) {
    return (
      <Alert
        title="Error cargando venta"
        message={dictionary.msg[message as keyof typeof dictionary.msg] || 'No se pudo cargar la venta. Intente nuevamente.'}
        variant="error"
      />
    );
  }

  if (!sale) {
    return (
      <Alert
        title={`La venta con ID ${id} no fue encontrada`}
        message={dictionary.msg[message as keyof typeof dictionary.msg] || 'Venta no encontrada.'}
        variant="warning"
      />
    );
  }

  return <DailySaleForm dailySale={sale} isNew={false}/>;
}