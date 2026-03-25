import get, {GetParams} from "@/server/services/get";


export type User = {
  name: string;
  email: string;
  role_id: number;
  role: string;
  id: string;
  phone: string;
}

type ResUser = {
  data: {
    count: number;
    items: User[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const getUsers = async ({search, ...params}: GetParams = {}): Promise<ResUser> => {

  const {data, error, success, message} = await get({
    table: 'profile_info',
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