import {Category, updateCategory} from "@/server/store/categoryRepository/index";

type ResSoftRestoreCategory = {
  data: {
    items: Category[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

type Params = {
  id: number | string;
  returning?: boolean;
}

const softRestoreCategory = async ({id, returning = true}: Params): Promise<ResSoftRestoreCategory> => {

  const {data: result, error, success, message} = await updateCategory({
    data: {
      date_deleted: null
    },
    eq: {id},
    returning
  })

  return {data: result, error, success, message};
}

export default softRestoreCategory;
