import get from "@/server/services/get";
import {Product} from "@/server/store/productRepository";

type ResGetById = {
  data: {
    items: Product[];
    count: number;
  };
  error: string | null;
  success: boolean;
  message: string;
}

type Params = {
  id: number | string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  ascending?: boolean;
  search?: string;
  getAll?: boolean;
  getDeleted?: boolean;
}

const getById = async ({id, page, pageSize, orderBy, ascending, search, getAll}: Params): Promise<ResGetById> => {

  const {data, error, success, message} = await get({
    table: 'product_snapshot',
    page,
    pageSize,
    orderBy,
    ascending,
    eq: {report_id: id},
    search: search ? {
      query: search,
      columns: ['name', 'category', 'shelf', 'type_unity']
    } : undefined,
    getAll
  });

  if (!success) {
    return {data, error, success, message};
  }

  if (!data || data.count === 0) {
    return {data, error, success, message: 'DATA_NOT_FOUND'};
  }

  return {data, error, success, message};
}

export default getById;