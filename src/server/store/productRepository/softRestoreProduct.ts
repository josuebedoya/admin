import {Product} from "@/server/store/productRepository/index";
import updateProduct from "@/server/store/productRepository/updateProduct";

type ResSoftRestoreProduct = {
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

const softRestoreProduct = async ({id, returning = true}: Params): Promise<ResSoftRestoreProduct> => {

  const {data: result, error, success, message} = await updateProduct({
    data: {
      date_deleted: null
    },
    eq: {id},
    returning
  })

  return {data: result, error, success, message};
}

export default softRestoreProduct;
