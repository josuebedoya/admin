import getBy from "@/server/services/getBy";

type Report = {
  id: number | string;
  name: string;
  date_created: string;
}

type ResGetById = {
  data: Report | null;
  error: string | null;
  success: boolean;
  message: string;
}

type Params = {
  id: number | string;
}

const getById = async ({ id }: Params): Promise<ResGetById> => {

  const { data, error, success, message } = await getBy({
    table: 'report',
    id
  });

  if (!success) {
    return { data: null, error, success, message };
  }

  const item = data.items[ 0 ];

  if (!item) {
    return { data: null, error, success, message: 'REPORT_NOT_FOUND' };
  }

  return { data: item, error, success, message };
}

export default getById;