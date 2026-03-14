import get from "@/server/services/get";

type Product = {
  id: number | string;
  name: string;
  status: boolean;
  category_id: number | string;
  shelf_id: number | string;
  category: string;
  shelf: string;
  quantity: number;
  type_unity: string;
  price: number;
  price_sale: number;
}

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
}

const getById = async ({ id, page, pageSize, orderBy, ascending, search }: Params): Promise<ResGetById> => {

  const { data, error, success, message } = await get({
    table: 'product_snapshot_report',
    page,
    pageSize,
    orderBy,
    ascending,
    eq: {report_id: id},
    search: search ? {
      query: search,
      columns: ['name', 'category', 'shelf', 'type_unity']
    } : undefined,
  });

  if (!success) {
    return { data, error, success, message };
  }

  if (!data || data.count === 0) {
    return { data, error, success, message: 'DATA_NOT_FOUND' };
  }

  return { data, error, success, message };
}

export default getById;