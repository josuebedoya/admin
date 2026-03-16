import {DailySale, updateDailySale} from "@/server/store/dailySaleRepository/index";

type ResSoftDeleteDailySale = {
  data: {
    items: DailySale[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

type Params = {
  id: number | string;
  returning?: boolean;
}

const softDeleteDailySale = async ({id, returning = true}: Params): Promise<ResSoftDeleteDailySale> => {

  const {data: result, error, success, message} = await updateDailySale({
    data: {
      date_deleted: new Date().toISOString()
    },
    eq: {id},
    returning
  });

  return {data: result, error, success, message};
}

export default softDeleteDailySale;

