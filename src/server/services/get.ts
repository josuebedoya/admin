import supabase from "@/server/client";
import ResApi from "@/server/resApi";
import { enhancedSearch } from "@/utils/searchUtils";

type ParamsGetCommon = {
  columns?: string[] | string;
  eq?: {
    [key: string]: string | number | boolean;
  };
  page?: number;
  pageSize?: number;
  orderBy?: string;
  ascending?: boolean;
  onlyCount?: boolean;
  gte?: {
    [key: string]: string | number | boolean;
  };
  lt?: {
    [key: string]: string | number | boolean;
  };
}

type Params = ParamsGetCommon & {
  table: string;
  columns?: string[] | string;
  count?: 'exact' | 'planned' | 'estimated';
  getAll?: boolean;
  search?: {
    query: string;
    columns: string[];
  };
  getDeleted?: boolean;
}

export type GetParams = ParamsGetCommon & {
  search?: string;
  getAll?: boolean,
  getDeleted?: boolean,
  onlyCount?: boolean
};

export type ResGet = {
  data: {
    count: number;
    items: any[];
  };
  error: string | null;
  success: boolean;
  message: string;
}

const nullData = {
  count: 0,
  items: []
}

const get = async ({table, onlyCount = false, ...config}: Params): Promise<ResGet> => {

  try {
    let query = supabase
      .from(table)
      .select(
        [...config.columns || ''].join(', '),
        {count: config.search ? 'estimated' : (config.count || 'exact'), head: onlyCount}
      );

    // REMOVED: Database-level search - will be done with enhanced search on the results
    // This allows us to support fuzzy matching and accent-insensitive search

    // Date deleted filters
    if (!config.getDeleted) {
      query = query.is('date_deleted', null);
    } else {
      console.log('trayendo eliminados')
      query = query.not('date_deleted', 'is', 'null');
    }

    // Eq conditions filters
    query = query.match((config.eq) || {});

    // GTE filters
    if (config.gte) {
      Object.entries(config.gte).forEach(([key, value]) => {
        query = query.gte(key, value as any);
      });
    }

    // LT filters
    if (config.lt) {
      Object.entries(config.lt).forEach(([key, value]) => {
        query = query.lt(key, value as any);
      });
    }

    // Order by - only if no search (search results will be ordered manually)
    if (config.orderBy && !config.search) {
      query = query.order(config.orderBy, {ascending: config.ascending ?? true});
    } else if (!config.search) {
      query = query.order('id', {ascending: false});
    }

    // Get all data if searching or if specifically requested
    // We'll handle pagination after filtering
    let {data, error, count} = await query;

    if (error) {
      console.error('Error triying get data from table: ', table, error.message)
      return ResApi({
        data: nullData,
        success: false,
        message: error.code || 'GET_DATA_FAILED',
        error: error.message,
        status: 401
      });
    }

    // Apply enhanced search filtering if search query exists
    if (config.search && config.search.query && config.search.columns.length > 0) {
      data = (data || []).filter((item: any) => {
        return config.search!.columns.some((column: string) => {
          const value = item[column];
          if (value == null) return false;
          return enhancedSearch(String(value), config.search!.query);
        });
      });
      // Update count after filtering
      count = data.length;
    }

    // Apply sorting if search was performed
    if (config.search && config.orderBy) {
      (data || []).sort((a: any, b: any) => {
        const aValue = a[config.orderBy!];
        const bValue = b[config.orderBy!];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return config.ascending ? -1 : 1;
        if (bValue == null) return config.ascending ? 1 : -1;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return config.ascending ? aValue - bValue : bValue - aValue;
        }

        const textA = String(aValue).toLowerCase();
        const textB = String(bValue).toLowerCase();
        if (textA < textB) return config.ascending ? -1 : 1;
        if (textA > textB) return config.ascending ? 1 : -1;
        return 0;
      });
    }

    // Apply pagination after filtering (for search results)
    if (!config.getAll && (config.search || count! > 0)) {
      const page = config.page || 1;
      const pageSize = config.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize;
      data = (data || []).slice(from, to);
    }

    return ResApi({
      data: {
        count: count ?? 0,
        items: data
      },
      success: true,
      message: 'GET_DATA_SUCCESS',
      error: error,
      status: 200
    });

  } catch (error) {
    console.error('Error triying get data from table: ', table, error instanceof Error ? error.message : error)
    return ResApi({
      data: nullData,
      success: false,
      message: 'GET_DATA_ERROR',
      error: error instanceof Error ? error.message : error,
      status: 500
    });
  }
}

export default get;