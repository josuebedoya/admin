import update, { updateParams } from "@/server/services/update";

type ProductUpdate = {
  name?: string;
  status?: boolean;
  category_id?: number | string;
  shelf_id?: number | string;
  quantity?: number;
  type_unity?: string;
  price?: number;
  price_sale?: number;
}

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

type ResUpdateProduct = {
  data: {
    items: Product[]
  }
  error: string | null;
  success: boolean;
  message: string;
}

const updateProduct = async ({ data, eq, returning = true }: updateParams): Promise<ResUpdateProduct> => {

  const { data: result, error, success, message } = await update({
    table: 'product',
    data,
    eq,
    returning
  });

  return { data: result, error, success, message };
}

export default updateProduct;
