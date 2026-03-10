import Form from "@/components/form/Form";
import FormProduct from "@/components/store/formProduct";
import Alert from "@/components/ui/alert/Alert";
import { dictionary } from "@/dictionary";
import { getProductById } from "@/server/store/productRepository";

type PageProps = {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === '%2B' || id === '+';

  if (isNew) {
    return <FormProduct product={null} isNew={true} />;
  }

  const { data: product, message, success } = await getProductById({ id });

  if (!success) {
    return (
      <Alert
        title='Error cargando producto'
        message={dictionary.msg[ message as keyof typeof dictionary.msg ] || 'No se pudo cargar el producto. Intente nuevamente.'}
        variant="error"
        key='errror'
      />
    );
  }

  if (!product) {
    return (
      <Alert
        title={`El producto con ID ${id} no fue encontrado`}
        message={dictionary.msg[ message as keyof typeof dictionary.msg || 'PRODUCT_NOT_FOUND' ]}
        variant="warning"
        key='not-found'
      />
    );
  }

  return <FormProduct product={product} isNew={false} />;
}