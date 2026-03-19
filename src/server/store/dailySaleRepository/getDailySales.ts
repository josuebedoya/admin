import get, {GetParams} from "@/server/services/get";
import {DailySale} from "@/server/store/dailySaleRepository/index";
import supabase from "@/server/client";

type ResSale = {
  data: {
    count: number;
    items: DailySale[]
    total_sales: {
      total_global: number;
      total_current_month: number;
    }
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


  const {data: total_sales} = await supabase
    .from('sales_totals')
    .select('*') as { data: { total_global: number; total_current_month: number }[] };

  const joinedData = {
    ...data,
    total_sales: total_sales?.[0]
  }

  return {data: joinedData, error, success, message};
}

export default getDailySales;