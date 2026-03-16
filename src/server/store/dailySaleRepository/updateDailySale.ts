import update, {updateParams} from "@/server/services/update";
import {DailySale} from "@/server/store/dailySaleRepository/index";

type ResUpdateDailySale = {
  data: {
    items: DailySale[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const MAX_NUMERIC_VALUE = 99999999.99;

const updateDailySale = async ({data, eq, returning = true}: updateParams): Promise<ResUpdateDailySale> => {

  if (data.transferred > MAX_NUMERIC_VALUE || data.cashed > MAX_NUMERIC_VALUE) {
    return {
      data: {items: []},
      error: "NUMERIC_OVERFLOW",
      success: false,
      message: "El valor ingresado excede el límite permitido (99,999,999.99)",
    };
  }

  const {data: result, error, success, message} = await update({
    table: 'daily_sale',
    data,
    eq,
    returning
  });

  return {data: result, error, success, message};
}

export default updateDailySale;
