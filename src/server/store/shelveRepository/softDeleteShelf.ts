import {Shelve, updateShelve} from "@/server/store/shelveRepository/index";

type ResSoftDeleteShelf = {
  data: {
    items: Shelve[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

type Params = {
  id: number | string;
  returning?: boolean;
}

const softDeleteShelf = async ({id, returning = true}: Params): Promise<ResSoftDeleteShelf> => {

  const {data: result, error, success, message} = await updateShelve({
    data: {
      date_deleted: new Date().toISOString()
    },
    eq: {id},
    returning
  });

  return {data: result, error, success, message};
}

export default softDeleteShelf;
