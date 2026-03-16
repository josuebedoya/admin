'use server';

import getProducts from '@/server/store/productRepository/getProducts';
import createProduct from '@/server/store/productRepository/createProduct';
import updateProduct from '@/server/store/productRepository/updateProduct';
import getShelves from '@/server/store/shelveRepository/getShelves';
import createShelve from '@/server/store/shelveRepository/createShelve';
import updateShelve from '@/server/store/shelveRepository/updateShelve';
import getCategories from '@/server/store/categoryRepository/getCategories';
import createCategory from '@/server/store/categoryRepository/createCategory';
import updateCategory from '@/server/store/categoryRepository/updateCategory';
import getDailySales from '@/server/store/dailySaleRepository/getDailySales';
import createDailySale from '@/server/store/dailySaleRepository/createDailySale';
import updateDailySale from '@/server/store/dailySaleRepository/updateDailySale';
import getReports from '@/server/store/reportsRepository/getReports';
import {getProductSnapshotById} from '@/server/store/productSnapshotRepository';
import createReport from '../store/reportsRepository/createReport';
import updateReport from '../store/reportsRepository/updateReport';
import {formattedDate} from '@/utils';
import createProductSnapshot from '../store/productSnapshotRepository/createProductSnapshot';
import softDeleteProduct from "@/server/store/productRepository/softDeleteProduct";
import deleteBy from "@/server/services/deleteBy";
import softRestoreProduct from "@/server/store/productRepository/softRestoreProduct";
import softDeleteShelf from "@/server/store/shelveRepository/softDeleteShelf";
import softRestoreShelf from "@/server/store/shelveRepository/softRestoreShelf";
import softDeleteDailySale from "@/server/store/dailySaleRepository/softDeleteDailySale";
import softRestoreDailySale from "@/server/store/dailySaleRepository/softRestoreDailySale";
import softDeleteReport from "@/server/store/reportsRepository/softDeleteReport";
import softRestoreReport from "@/server/store/reportsRepository/softRestoreReport";
import softDeleteCategory from "@/server/store/categoryRepository/softDeleteCategory";
import softRestoreCategory from "@/server/store/categoryRepository/softRestoreCategory";

type TypeFetch = (
  page: number,
  pageSize: number,
  orderBy?: string,
  ascending?: boolean,
  search?: string,
  getAll?: boolean,
  getDeleted?: boolean
) => void;


// Fetch
export async function fetchProducts(...[page, pageSize, orderBy, ascending, search, getAll, getDeleted]: Parameters<TypeFetch>) {
  const {data, error} = await getProducts({page, pageSize, orderBy, ascending, search, getAll, getDeleted});
  if (error) throw new Error(error);
  return data;
}

export async function fetchShelves(...[page, pageSize, orderBy, ascending, search, getAll, getDeleted]: Parameters<TypeFetch>) {
  const {data, error} = await getShelves({page, pageSize, orderBy, ascending, search, getAll, getDeleted});
  if (error) throw new Error(error);
  return data;
}

export async function fetchCategories(...[page, pageSize, orderBy, ascending, search, getAll, getDeleted]: Parameters<TypeFetch>) {
  const {data, error} = await getCategories({page, pageSize, orderBy, ascending, search, getAll, getDeleted});
  if (error) throw new Error(error);
  return data;
}

export async function fetchDailySales(...[page, pageSize, orderBy, ascending, search, getAll, getDeleted]: Parameters<TypeFetch>) {
  const {data, error} = await getDailySales({page, pageSize, orderBy, ascending, search, getAll, getDeleted});
  if (error) throw new Error(error);
  return data;
}

export async function fetchReports(...[page, pageSize, orderBy, ascending, search, getAll, getDeleted]: Parameters<TypeFetch>) {
  const {data, error} = await getReports({page, pageSize, orderBy, ascending, search, getAll, getDeleted});
  if (error) throw new Error(error);
  return data;
}

export async function fetchProductSnapshotsByReportId(
  reportId: string | number,
  ...[page, pageSize, orderBy, ascending, search, getAll, getDeleted]: Parameters<TypeFetch>
) {
  const {data, error} = await getProductSnapshotById({
    id: reportId, page, pageSize, orderBy, ascending, search, getAll, getDeleted
  });

  if (error) throw new Error(error);
  return data;
}


// Save
export async function saveProduct(data: any, isNew: boolean, productId?: string | number) {
  try {
    if (isNew) {
      const result = await createProduct({data, returning: true});
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
        eq: {id: productId},
        returning: true
      });
      return result;
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'SAVE_PRODUCT_ERROR',
      data: {items: []}
    };
  }
}

export async function saveCategory(data: any, isNew: boolean, categoryId?: string | number) {
  try {
    if (isNew) {
      const result = await createCategory({data, returning: true});
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
        eq: {id: categoryId},
        returning: true
      });
      return result;
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'SAVE_CATEGORY_ERROR',
      data: {items: []}
    };
  }
}

export async function saveShelve(data: any, isNew: boolean, shelveId?: string | number) {
  try {
    if (isNew) {
      const result = await createShelve({data, returning: true});
      return result;
    } else {
      if (!shelveId) {
        return {
          success: false,
          error: 'Shelve ID is required for update',
          message: 'Shelve ID is required for update',
          data: null,
          status: 400
        };
      }
      const result = await updateShelve({
        data,
        eq: {id: shelveId},
        returning: true
      });
      return result;
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'SAVE_SHELVE_ERROR',
      data: {items: []}
    };
  }
}

export async function saveDailySale(data: any, isNew: boolean, dailySaleId?: string | number) {
  try {
    if (isNew) {
      const result = await createDailySale({data, returning: true});
      return result;
    } else {
      if (!dailySaleId) {
        return {
          success: false,
          error: 'Daily Sale ID is required for update',
          message: 'Daily Sale ID is required for update',
          data: null,
          status: 400
        };
      }
      const result = await updateDailySale({
        data,
        eq: {id: dailySaleId},
        returning: true
      });
      return result;
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'SAVE_DAILY_SALE_ERROR',
      data: {items: []}
    };
  }
}

export async function saveReport(data: any, isNew: boolean, reportId?: string | number) {
  try {
    if (isNew) {
      const result = await createReport({data, returning: true});
      return result;
    } else {
      if (!reportId) {
        return {
          success: false,
          error: 'Report ID is required for update',
          message: 'Report ID is required for update',
          data: null,
          status: 400
        };
      }
      const result = await updateReport({
        data,
        eq: {id: reportId},
        returning: true
      });
      return result;
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'SAVE_REPORT_ERROR',
      data: {items: []}
    };
  }
}

export async function saveProductSnapshot(data: any) {
  try {
    const inputName = typeof data === 'string' ? data : data?.nameReport;
    const nameReport = inputName?.trim() || `Reporte ${formattedDate(new Date(), 'medium')}`;

    // create a report
    const {data: dataReport, error, success} = await saveReport({name: nameReport}, true);

    if (!success || error) {
      return {
        success,
        error: error || 'Failed to save report',
        message: 'SAVE_PRODUCT_SNAPSHOT_ERROR',
        data: {items: []}
      };
    }

    const report = dataReport?.items?.[0];

    if (!report) {
      return {
        success: false,
        error: 'Report was not created successfully',
        message: 'SAVE_PRODUCT_SNAPSHOT_ERROR',
        data: {items: []}
      };
    }

    // create product snapshot using the new report's id
    const snapshotResult = await createProductSnapshot({data: {report_id: report.id}, returning: true});

    if (!snapshotResult.success) {
      return {
        success: false,
        error: snapshotResult.error || 'Failed to save product snapshot',
        message: 'SAVE_PRODUCT_SNAPSHOT_ERROR',
        data: {items: []}
      };
    }

    return {
      success: true,
      error: null,
      message: 'SAVE_PRODUCT_SNAPSHOT_SUCCESS',
      data: {report, snapshots: snapshotResult.data?.items ?? []}
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'SAVE_PRODUCT_SNAPSHOT_ERROR',
      data: {items: []}
    };
  }
}


// Soft delete
export async function deleteProduct(id: string | number, soft = true) {
  if (soft) return await softDeleteProduct({id});

  return await deleteBy({table: 'product', eq: {id}});
}

export async function deleteReport(id: string | number, soft = true) {
  if (soft) return await softDeleteReport({id});

  return await deleteBy({table: 'report', eq: {id}});
}

export async function deleteCategory(id: string | number, soft = true) {
  if (soft) return await softDeleteCategory({id});

  return await deleteBy({table: 'category', eq: {id}});
}

export async function deleteShelf(id: string | number, soft = true) {
  if (soft) return await softDeleteShelf({id});

  return await deleteBy({table: 'shelf', eq: {id}});
}

export async function deleteDailySale(id: string | number, soft = true) {
  if (soft) return await softDeleteDailySale({id});

  return await deleteBy({table: 'daily_sale', eq: {id}});
}


// Soft restore
export async function restoreProduct(id: string | number) {
  return await softRestoreProduct({id});
}

export async function restoreShelf(id: string | number) {
  return await softRestoreShelf({id});
}

export async function restoreCategory(id: string | number) {
  return await softRestoreCategory({id});
}

export async function restoreDailySale(id: string | number) {
  return await softRestoreDailySale({id});
}

export async function restoreReport(id: string | number) {
  return await softRestoreReport({id});
}
