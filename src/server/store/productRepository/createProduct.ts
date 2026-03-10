import create, { createParams } from "@/server/services/create";

type Product = {
  id: number | string;
  name: string;
  status: boolean;
  category_id: number | string;
  shelf_id: number | string;
  quantity: number;
  type_unity: string;
  price: number;
  price_sale: number;
}

type ResCreateProduct = {
  data: {
    items: Product[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const createProduct = async ({ data, returning = true }: createParams): Promise<ResCreateProduct> => {

  const { data: result, error, success, message } = await create({
    table: 'product',
    data,
    returning
  });

  return { data: result, error, success, message };
}

export default createProduct;
