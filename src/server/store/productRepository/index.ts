import getProducts from "./getProducts";
import getById from "./getById";

export {
  getProducts,
  getById as getProductById
}

export type Product = {
  id: number | string;
  name: string;
  status: boolean;
  category_id: number | string;
  shelf_id: number | string;
  quantity: number;
  type_unity: string;
  price: number;
  price_sale: number;
  date_deleted: string | null;
  category: string;
  shelf: string;
}