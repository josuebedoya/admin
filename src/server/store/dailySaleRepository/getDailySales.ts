import get, {GetParams} from "@/server/services/get";
import {DailySale} from "@/server/store/dailySaleRepository/index";

type ResSale = {
  data: {
    count: number;
    items: DailySale[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const getDailySales = async ({search, ...params}: GetParams = {}): Promise<ResSale> => {

  const {data, success, message, error} = await get({
    table: 'daily_sale',
    count: 'estimated',
    search: search ? {
      query: search,
      columns: ['note']
    } : undefined,
    ...params
  });

  return {data, error, success, message};
}

export default getDailySales;