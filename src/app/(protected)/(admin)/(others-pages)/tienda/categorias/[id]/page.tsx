import CategoryForm from "@/components/store/formCategory";
import Alert from "@/components/ui/alert/Alert";
import {dictionary} from "@/dictionary";
import {getCategoryById} from "@/server/store/categoryRepository";

type PageProps = {
  params: Promise<{ id: string }>;
}

export default async function CategoryPage({params}: PageProps) {
  const {id} = await params;
  const isNew = id === '%2B' || id === '+';

  if (isNew) {
    return <CategoryForm category={null} isNew={true}/>;
  }

  const {data: category, message, success} = await getCategoryById({id});

  if (!success) {
    return (
      <Alert
        title="Error cargando categoría"
        message={dictionary.msg[message as keyof typeof dictionary.msg] || 'No se pudo cargar la categoría. Intente nuevamente.'}
        variant="error"
      />
    );
  }

  if (!category) {
    return (
      <Alert
        title={`La categoría con ID ${id} no fue encontrada`}
        message={dictionary.msg[message as keyof typeof dictionary.msg] || 'Categoría no encontrada.'}
        variant="warning"
      />
    );
  }

  return <CategoryForm category={category} isNew={false}/>;
}