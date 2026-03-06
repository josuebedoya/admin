import get, {getParams} from "@/server/services/get";

type Shelve = {
  id: number | string;
  name: string;
  status: boolean;
  products: number;
}

type ResShelf = {
  data: {
    count: number;
    items: Shelve[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const getShelves = async ({...params}: getParams = {}): Promise<ResShelf> => {

  const {data, success, message, error} = await get(
    {
      table: 'shelf_with_products',
      count: 'estimated',
      ...params
    });

  return {data, error, success, message};
}

export default getShelves;