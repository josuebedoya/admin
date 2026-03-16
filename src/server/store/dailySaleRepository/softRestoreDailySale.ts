import {DailySale, updateDailySale} from "@/server/store/dailySaleRepository/index";

type ResSoftRestoreDailySale = {
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

const softRestoreDailySale = async ({id, returning = true}: Params): Promise<ResSoftRestoreDailySale> => {

  const {data: result, error, success, message} = await updateDailySale({
    data: {
      date_deleted: null
    },
    eq: {id},
    returning
  });

  return {data: result, error, success, message};
}

export default softRestoreDailySale;

