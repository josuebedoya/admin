import getCategories from "./getCategories";
import getById from "./getById";
import createCategory from "./createCategory";
import updateCategory from "./updateCategory";
import softDeleteCategory from "./softDeleteCategory";
import softRestoreCategory from "./softRestoreCategory";

export {
  getCategories,
  getById as getCategoryById,
  createCategory,
  updateCategory,
  softDeleteCategory,
  softRestoreCategory
}

export type Category = {
  id: number | string;
  name: string;
  status: boolean;
  products: number;
  date_deleted: string | null;
}
