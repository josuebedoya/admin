import create, {createParams} from "@/server/services/create";
import {Shelve} from "@/server/store/shelveRepository/index";

type ResCreateShelve = {
  data: {
    items: Shelve[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const createShelve = async ({data, returning = true}: createParams): Promise<ResCreateShelve> => {

  const {data: result, error, success, message} = await create({
    table: 'shelf',
    data,
    returning
  });

  return {data: result, error, success, message};
}

export default createShelve;

