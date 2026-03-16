import {Category, updateCategory} from "@/server/store/categoryRepository/index";

type ResSoftDeleteProduct = {
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

const softDeleteCategory = async ({id, returning = true}: Params): Promise<ResSoftDeleteProduct> => {

  const {data: result, error, success, message} = await updateCategory({
    data: {
      date_deleted: new Date().toISOString()
    },
    eq: {id},
    returning
  })

  return {data: result, error, success, message};
}

export default softDeleteCategory;
