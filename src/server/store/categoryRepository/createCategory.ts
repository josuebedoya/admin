import create, {createParams} from "@/server/services/create";
import {Category} from "@/server/store/categoryRepository/index";

type ResCreateCategory = {
  data: {
    items: Category[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const createCategory = async ({data, returning = true}: createParams): Promise<ResCreateCategory> => {

  const {data: result, error, success, message} = await create({
    table: 'category',
    data,
    returning
  });

  return {data: result, error, success, message};
}

export default createCategory;

