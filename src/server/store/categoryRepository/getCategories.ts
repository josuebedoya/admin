import get, { getParams } from "@/server/services/get";

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

const getCategories = async ({ ...params }: getParams = {}): Promise<ResCategory> => {

  const { data, success, message, error } = await get(
    {
      table: 'category_with_products',
      count: 'estimated',
      ...params
    });

  return { data, error, success, message };
}

export default getCategories;