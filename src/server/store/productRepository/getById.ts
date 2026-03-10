import getBy from "@/server/services/getBy";

type Product = {
  id: number | string;
  name: string;
  status: boolean;
  category_id: number | string;
  shelf_id: number | string;
  category: string;
  shelf: string;
  quantity: number;
  type_unity: string;
  price: number;
  price_sale: number;
}

type ResGetById = {
  data: Product | null;
  error: string | null;
  success: boolean;
  message: string;
}

type Params = {
  id: number | string;
}

const getById = async ({ id }: Params): Promise<ResGetById> => {

  const { data, error, success, message } = await getBy({
    table: 'product',
    id
  });

  if (!success) {
    return { data: null, error, success, message };
  }

  const item = data.items[ 0 ];

  if (!item) {
    return { data: null, error, success, message: 'PRODUCT_NOT_FOUND' };
  }

  return { data: item, error, success, message };
}

export default getById;