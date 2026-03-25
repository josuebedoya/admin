import update, {updateParams} from "@/server/services/update";
import {Role} from "@/server/auth/getRoles";

type ResUpdateRole = {
  data: {
    items: Role[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const updateUser = async ({data, eq, returning = true}: updateParams): Promise<ResUpdateRole> => {

  const {data: result, error, success, message} = await update({
    table: 'profiles',
    data,
    eq,
    returning
  });

  return {data: result, error, success, message};
}

export default updateUser;
