import getShelves from "./getShelves";
import getById from "./getById";
import createShelve from "./createShelve";
import updateShelve from "./updateShelve";

export {
  getShelves,
  getById as getShelveById,
  createShelve,
  updateShelve,
}

export type Shelve = {
  id: number | string;
  name: string;
  status: boolean;
  products: number;
  total_price: number;
  total_price_sale: number;
  date_deleted: string | null;
}