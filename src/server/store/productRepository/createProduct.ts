import create, {createParams} from "@/server/services/create";
import {Product} from "@/server/store/productRepository/index";

type ResCreateProduct = {
  data: {
    items: Product[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const createProduct = async ({data, returning = true}: createParams): Promise<ResCreateProduct> => {

  const {data: result, error, success, message} = await create({
    table: 'product',
    data,
    returning
  });

  return {data: result, error, success, message};
}

export default createProduct;
