import update, {updateParams} from "@/server/services/update";
import {Category} from "@/server/store/categoryRepository/index";

type ResUpdateCategory = {
  data: {
    items: Category[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const updateCategory = async ({data, eq, returning = true}: updateParams): Promise<ResUpdateCategory> => {

  const {data: result, error, success, message} = await update({
    table: 'category',
    data,
    eq,
    returning
  });

  return {data: result, error, success, message};
}

export default updateCategory;

