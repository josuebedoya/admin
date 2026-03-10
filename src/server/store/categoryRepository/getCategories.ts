import get, {GetParams} from "@/server/services/get";

type Category = {
  id: number | string;
  name: string;
  status: boolean;
  products: number;
}

type ResCategory = {
  data: {
    count: number;
    items: Category[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const getCategories = async ({search, ...params}: GetParams = {}): Promise<ResCategory> => {

  const {data, success, message, error} = await get({
    table: 'category_with_products',
    count: 'estimated',
    search: search ? {
      query: search,
      columns: ['name']
    } : undefined,
    ...params
  });

  return {data, error, success, message};
}

export default getCategories;