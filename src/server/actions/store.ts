'use server';

import getProducts from '@/server/store/getProducts';
import getShelves from '@/server/store/getShelves';
import getCategories from '@/server/store/getCategories';
import getDailySales from '@/server/store/getDailySales';

export async function fetchProducts(page: number, pageSize: number) {
  const { data, error } = await getProducts({ page, pageSize });
  if (error) throw new Error(error);
  return data;
}

export async function fetchShelves(page: number, pageSize: number) {
  const { data, error } = await getShelves({ page, pageSize });
  if (error) throw new Error(error);
  return data;
}

export async function fetchCategories(page: number, pageSize: number) {
  const { data, error } = await getCategories({ page, pageSize });
  if (error) throw new Error(error);
  return data;
}

export async function fetchDailySales(page: number, pageSize: number) {
  const { data, error } = await getDailySales({ page, pageSize });
  if (error) throw new Error(error);
  return data;
}
