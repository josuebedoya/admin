import getBy from "@/server/services/getBy";
import {User} from "@/server/auth/getUsers";

type ResGetById = {
  data: User | null;
  error: string | null;
  success: boolean;
  message: string;
}

type Params = {
  id: number | string;
}

const getById = async ({id}: Params): Promise<ResGetById> => {

  const {data, error, success, message} = await getBy({
    table: 'profile_info',
    id
  });

  if (!success) {
    return {data: null, error, success, message};
  }

  const item = data.items[0];

  if (!item) {
    return {data: null, error, success, message: 'PROFILE_NOT_FOUND'};
  }

  return {data: item, error, success, message};
}

export default getById;