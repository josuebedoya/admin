import ShelfForm from "@/components/store/formShelf";
import Alert from "@/components/ui/alert/Alert";
import {dictionary} from "@/dictionary";
import {getShelveById} from "@/server/store/shelveRepository";

type PageProps = {
  params: Promise<{ id: string }>;

};

export default async function ShelfPage({params}: PageProps) {
  const {id} = await params;
  const isNew = id === '%2B' || id === '+';

  if (isNew) {
    return <ShelfForm shelf={null} isNew={true}/>;
  }

  const {data: shelf, message, success} = await getShelveById({id});

  if (!success) {
    return (
      <Alert
        title="Error cargando estantería"
        message={dictionary.msg[message as keyof typeof dictionary.msg] || 'No se pudo cargar la estantería. Intente nuevamente.'}
        variant="error"
      />
    );
  }

  if (!shelf) {
    return (
      <Alert
        title={`La estantería con ID ${id} no fue encontrada`}
        message={dictionary.msg[message as keyof typeof dictionary.msg] || 'Estantería no encontrada.'}
        variant="warning"
      />
    );
  }

  return <ShelfForm shelf={shelf} isNew={false}/>;
}