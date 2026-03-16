import get, {GetParams} from "@/server/services/get";
import {Product} from "@/server/store/productRepository/index";

type ResProduct = {
  data: {
    count: number;
    items: Product[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const getProducts = async ({search, ...params}: GetParams = {}): Promise<ResProduct> => {

  const {data, error, success, message} = await get({
    table: 'product_with_category_and_shelf',
    count: 'estimated',
    search: search ? {
      query: search,
      columns: ['name', 'category', 'shelf', 'type_unity']
    } : undefined,
    ...params
  });

  return {data, error, success, message};
}

export default getProducts;