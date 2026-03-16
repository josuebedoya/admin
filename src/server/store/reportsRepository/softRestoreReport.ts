import {Report, updateReport} from "@/server/store/reportsRepository/index";

type ResSoftRestoreReport = {
  data: {
    items: Report[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

type Params = {
  id: number | string;
  returning?: boolean;
}

const softRestoreReport = async ({id, returning = true}: Params): Promise<ResSoftRestoreReport> => {

  const {data: result, error, success, message} = await updateReport({
    data: {
      date_deleted: null
    },
    eq: {id},
    returning
  });

  return {data: result, error, success, message};
}

export default softRestoreReport;

