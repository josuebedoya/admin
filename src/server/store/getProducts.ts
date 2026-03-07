import get, {getParams} from "@/server/services/get";

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
}

type ResProduct = {
  data: {
    count: number | null;
    items: Product[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const getProducts = async ({...params}: getParams = {}): Promise<ResProduct> => {

  const {data, error, success, message} = await get({
    table: 'product_with_category_and_shelf',
    count: 'estimated',
    ...params
  });

  return {data, error, success, message};
}

export default getProducts;