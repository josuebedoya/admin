import {Shelve, updateShelve} from "@/server/store/shelveRepository/index";

type ResSoftRestoreShelf = {
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

const softRestoreShelf = async ({id, returning = true}: Params): Promise<ResSoftRestoreShelf> => {

  const {data: result, error, success, message} = await updateShelve({
    data: {
      date_deleted: null
    },
    eq: {id},
    returning
  });

  return {data: result, error, success, message};
}

export default softRestoreShelf;
