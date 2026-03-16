import {Product} from "@/server/store/productRepository/index";
import updateProduct from "@/server/store/productRepository/updateProduct";

type ResSoftDeleteProduct = {
  data: {
    items: Product[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

type Params = {
  id: number | string;
  returning?: boolean;
}

const softDeleteProduct = async ({id, returning = true}: Params): Promise<ResSoftDeleteProduct> => {

  const {data: result, error, success, message} = await updateProduct({
    data: {
      date_deleted: new Date().toISOString()
    },
    eq: {id},
    returning
  })

  return {data: result, error, success, message};
}

export default softDeleteProduct;
