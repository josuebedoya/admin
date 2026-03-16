import get, {GetParams} from "@/server/services/get";
import {Report} from "@/server/store/reportsRepository/index";

type ResReport = {
  data: {
    count: number;
    items: Report[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const getReports = async ({search, ...params}: GetParams = {}): Promise<ResReport> => {

  const {data, error, success, message} = await get({
    table: 'report',
    count: 'estimated',
    search: search ? {
      query: search,
      columns: ['name', 'date_created']
    } : undefined,
    ...params
  });

  return {data, error, success, message};
}

export default getReports;