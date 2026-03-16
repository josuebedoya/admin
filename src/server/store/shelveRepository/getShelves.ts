import get, {GetParams} from "@/server/services/get";
import {Shelve} from "@/server/store/shelveRepository/index";

type ResShelf = {
  data: {
    count: number;
    items: Shelve[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const getShelves = async ({search, ...params}: GetParams = {}): Promise<ResShelf> => {

  const {data, success, message, error} = await get({
    table: 'shelf_with_products',
    count: 'estimated',
    search: search ? {
      query: search,
      columns: ['name']
    } : undefined,
    ...params
  });

  return {data, error, success, message};
}

export default getShelves;