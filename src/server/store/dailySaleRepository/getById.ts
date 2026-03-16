import getBy from "@/server/services/getBy";
import {DailySale} from "@/server/store/dailySaleRepository/index";

type ResGetById = {
  data: DailySale | null;
  error: string | null;
  success: boolean;
  message: string;
}

type Params = {
  id: number | string;
}

const getById = async ({id}: Params): Promise<ResGetById> => {

  const {data, error, success, message} = await getBy({
    table: 'daily_sale',
    id
  });

  if (!success) {
    return {data: null, error, success, message};
  }

  const item = data.items[0];

  if (!item) {
    return {data: null, error, success, message: 'SALE_NOT_FOUND'};
  }

  return {data: item, error, success, message};
}

export default getById;

