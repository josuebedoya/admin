import update, {updateParams} from "@/server/services/update";
import {Shelve} from "@/server/store/shelveRepository/index";

type ResUpdateShelve = {
  data: {
    items: Shelve[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const updateShelve = async ({data, eq, returning = true}: updateParams): Promise<ResUpdateShelve> => {

  const {data: result, error, success, message} = await update({
    table: 'shelf',
    data,
    eq,
    returning
  });

  return {data: result, error, success, message};
}

export default updateShelve;

