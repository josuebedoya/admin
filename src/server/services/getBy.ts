import get, { ResGet } from "@/server/services/get";

type Params = {
  table: string;
  [ key: string ]: string | number | boolean;
}

const getBy = async ({ table, ...query }: Params): Promise<ResGet> => {

  const { data, error, success, message } = await get({
    table,
    count: 'estimated',
    eq: query
  });

  return { data, error, success, message };
}

export default getBy;