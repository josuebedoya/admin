import get, {GetParams} from "@/server/services/get";


export type Role = {
  name: string;
  id: string;
  date_created: string;
  date_deleted: string;
}

type ResRole = {
  data: {
    count: number;
    items: Role[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const getUsers = async ({search, ...params}: GetParams = {}): Promise<ResRole> => {

  const {data, error, success, message} = await get({
    table: 'role',
    count: 'estimated',
    search: search ? {
      query: search,
      columns: ['name']
    } : undefined,
    ...params,
  });

  return {data, error, success, message};
}

export default getUsers;