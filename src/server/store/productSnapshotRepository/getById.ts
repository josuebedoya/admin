import get from "@/server/services/get";
import {Product} from "@/server/store/productRepository";

export type ProductExcel = Product & {
  shelf_name?: string;
  category_name?: string;
  product_id: string;
}

type ResGetById = {
  data: {
    items: ProductExcel[];
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
  onlyCount?: boolean;
}

const getById = async ({id, page, pageSize, orderBy, ascending, search, getAll, onlyCount}: Params): Promise<ResGetById> => {

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
    getAll,
    onlyCount
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