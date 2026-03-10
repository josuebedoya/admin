import getBy from "@/server/services/getBy";

type Shelve = {
  id: number | string;
  name: string;
  status: boolean;
  products: number;
  total_price: number;
  total_price_sale: number;
}

type ResGetById = {
  data: Shelve | null;
  error: string | null;
  success: boolean;
  message: string;
}

type Params = {
  id: number | string;
}

const getById = async ({id}: Params): Promise<ResGetById> => {

  const {data, error, success, message} = await getBy({
    table: 'shelf_with_products',
    id
  });

  if (!success) {
    return {data: null, error, success, message};
  }

  const item = data.items[0];

  if (!item) {
    return {data: null, error, success, message: 'SHELVE_NOT_FOUND'};
  }

  return {data: item, error, success, message};
}

export default getById;

