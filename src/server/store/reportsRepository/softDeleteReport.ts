import {Report, updateReport} from "@/server/store/reportsRepository/index";

type ResSoftDeleteReport = {
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

const softDeleteReport = async ({id, returning = true}: Params): Promise<ResSoftDeleteReport> => {

  const {data: result, error, success, message} = await updateReport({
    data: {
      date_deleted: new Date().toISOString()
    },
    eq: {id},
    returning
  });

  return {data: result, error, success, message};
}

export default softDeleteReport;

