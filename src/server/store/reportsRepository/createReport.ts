import create, { createParams } from "@/server/services/create";

type Report = {
  id: number | string;
  name: string;
  date_created: string;
}

type ResCreateReport = {
  data: {
    items: Report[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const createReport = async ({ data, returning = true }: createParams): Promise<ResCreateReport> => {

  const { data: result, error, success, message } = await create({
    table: 'report',
    data,
    returning
  });

  return { data: result, error, success, message };
}

export default createReport;
