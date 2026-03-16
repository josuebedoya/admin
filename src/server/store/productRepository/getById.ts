import getBy from "@/server/services/getBy";
import {Product} from "@/server/store/productRepository/index";

type ResGetById = {
  data: Product | null;
  error: string | null;
  success: boolean;
  message: string;
}

type Params = {
  id: number | string;
}

const getById = async ({id}: Params): Promise<ResGetById> => {

  const {data, error, success, message} = await getBy({
    table: 'product',
    id
  });

  if (!success) {
    return {data: null, error, success, message};
  }

  const item = data.items[0];

  if (!item) {
    return {data: null, error, success, message: 'PRODUCT_NOT_FOUND'};
  }

  return {data: item, error, success, message};
}

export default getById;