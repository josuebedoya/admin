import update, {updateParams} from "@/server/services/update";
import {Product} from "@/server/store/productRepository/index";

type ResUpdateProduct = {
  data: {
    items: Product[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const updateProduct = async ({data, eq, returning = true}: updateParams): Promise<ResUpdateProduct> => {

  const {data: result, error, success, message} = await update({
    table: 'product',
    data,
    eq,
    returning
  });

  return {data: result, error, success, message};
}

export default updateProduct;
