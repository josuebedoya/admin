import getBy from "@/server/services/getBy";
import {Category} from "@/server/store/categoryRepository/index";

type ResGetById = {
  data: Category | null;
  error: string | null;
  success: boolean;
  message: string;
}

type Params = {
  id: number | string;
}

const getById = async ({id}: Params): Promise<ResGetById> => {

  const {data, error, success, message} = await getBy({
    table: 'category_with_products',
    id
  });

  if (!success) {
    return {data: null, error, success, message};
  }

  const item = data.items[0];

  if (!item) {
    return {data: null, error, success, message: 'CATEGORY_NOT_FOUND'};
  }

  return {data: item, error, success, message};
}

export default getById;

