import supabase from "@/server/client";
import ResApi from "@/server/resApi";

type ParamsGetCommon = {
  columns?: string[] | string;
  eq?: {
    [key: string]: string | number | boolean;
  };
  page?: number;
  pageSize?: number;
  orderBy?: string;
  ascending?: boolean;
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

export type GetParams = ParamsGetCommon & { search?: string; getAll?: boolean, getDeleted?: boolean };

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

const get = async ({table, ...config}: Params): Promise<ResGet> => {

  try {
    let query = supabase
      .from(table)
      .select(
        [...config.columns || ''].join(', '),
        {count: config.count || 'exact'}
      );

    if (config.search && config.search.query && config.search.columns.length > 0) {
      const searchQuery = config.search.columns.map(col => `${col}.ilike.%${config.search!.query}%`).join(',');
      query = query.or(searchQuery);
    }

    if (!config.getDeleted) {
      query = query.is('date_deleted', null);
    } else {
      console.log('trayendo eliminados')
      query = query.not('date_deleted', 'is', 'null');
    }

    query = query.match((config.eq) || {});

    if (!config.getAll) {
      const page = config.page || 1;
      const pageSize = config.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
    }

    // Agregar ordenamiento si existe
    if (config.orderBy) {
      query = query.order(config.orderBy, {ascending: config.ascending ?? true});
    } else {
      query = query.order('id', {ascending: false});
    }

    const {data, error, count} = await query;

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