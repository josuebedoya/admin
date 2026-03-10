import create, { createParams } from "@/server/services/create";

type DailySale = {
  id: number | string;
  transferred: number;
  cashed: number;
  note: string;
  date_created: string;
}

type ResCreateDailySale = {
  data: {
    items: DailySale[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const MAX_NUMERIC_VALUE = 99999999.99; // Límite para numeric(10,2)

const createDailySale = async ({ data, returning = true }: createParams): Promise<ResCreateDailySale> => {

  if (data.transferred > MAX_NUMERIC_VALUE || data.cashed > MAX_NUMERIC_VALUE) {
    return {
      data: { items: [] },
      error: "NUMERIC_OVERFLOW",
      success: false,
      message: "El valor ingresado excede el límite permitido (99,999,999.99)",
    };
  }

  const { data: result, error, success, message } = await create({
    table: 'daily_sale',
    data,
    returning
  });

  return { data: result, error, success, message };
}

export default createDailySale;
