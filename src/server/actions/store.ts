'use server';

import getProducts from '@/server/store/productRepository/getProducts';
import createProduct from '@/server/store/productRepository/createProduct';
import updateProduct from '@/server/store/productRepository/updateProduct';
import getShelves from '@/server/store/shelveRepository/getShelves';
import getCategories from '@/server/store/categoryRepository/getCategories';
import createCategory from '@/server/store/categoryRepository/createCategory';
import updateCategory from '@/server/store/categoryRepository/updateCategory';
import getDailySales from '@/server/store/dailySaleRepository/getDailySales';

export async function fetchProducts(page: number, pageSize: number, orderBy?: string, ascending?: boolean) {
  const { data, error } = await getProducts({ page, pageSize, orderBy, ascending });
  if (error) throw new Error(error);
  return data;
}

export async function fetchShelves(page: number, pageSize: number, orderBy?: string, ascending?: boolean) {
  const { data, error } = await getShelves({ page, pageSize, orderBy, ascending });
  if (error) throw new Error(error);
  return data;
}

export async function fetchCategories(page: number, pageSize: number, orderBy?: string, ascending?: boolean) {
  const { data, error } = await getCategories({ page, pageSize, orderBy, ascending });
  if (error) throw new Error(error);
  return data;
}

export async function fetchDailySales(page: number, pageSize: number, orderBy?: string, ascending?: boolean) {
  const { data, error } = await getDailySales({ page, pageSize, orderBy, ascending });
  if (error) throw new Error(error);
  return data;
}

export async function saveProduct(data: any, isNew: boolean, productId?: string | number) {
  try {
    if (isNew) {
      const result = await createProduct({ data, returning: true });
      return result;
    } else {
      if (!productId) {
        return {
          success: false,
          error: 'Product ID is required for update',
          message: 'Product ID is required for update',
          data: null,
          status: 400
        };
      }
      const result = await updateProduct({ 
        data, 
        eq: { id: productId },
        returning: true 
      });
      return result;
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'SAVE_PRODUCT_ERROR',
      data: { items: [] }
    };
  }
}

export async function saveCategory(data: any, isNew: boolean, categoryId?: string | number) {
  try {
    if (isNew) {
      const result = await createCategory({ data, returning: true });
      return result;
    } else {
      if (!categoryId) {
        return {
          success: false,
          error: 'Category ID is required for update',
          message: 'Category ID is required for update',
          data: null,
          status: 400
        };
      }
      const result = await updateCategory({
        data,
        eq: { id: categoryId },
        returning: true
      });
      return result;
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'SAVE_CATEGORY_ERROR',
      data: { items: [] }
    };
  }
}

