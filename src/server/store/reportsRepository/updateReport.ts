import update, {updateParams} from "@/server/services/update";
import {Report} from "@/server/store/reportsRepository/index";


type ResUpdateReport = {
  data: {
    items: Report[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const updateReport = async ({data, eq, returning = true}: updateParams): Promise<ResUpdateReport> => {

  const {data: result, error, success, message} = await update({
    table: 'report',
    data,
    eq,
    returning
  });

  return {data: result, error, success, message};
}

export default updateReport;
