import get, { getParams } from "@/server/services/get";

type Sale = {
  id: number | string;
  transferred: number;
  cashed: number;
  note: number;
  date_created: string;
}

type ResSale = {
  data: {
    count: number;
    items: Sale[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const getDailySales = async ({ ...params }: getParams = {}): Promise<ResSale> => {

  const { data, success, message, error } = await get(
    {
      table: 'daily_sale',
      count: 'estimated',
      ...params
    });

  return { data, error, success, message };
}

export default getDailySales;