import supabase from "@/server/client";
import ResApi from "@/server/resApi";

type Params = {
  table: string;
  columns?: string[] | string;
  count?: 'exact' | 'planned' | 'estimated';
  eq?: {
    [key: string]: string | number | boolean;
  };
}

export  type getParams = Omit<Params, 'table' | 'count'>;

type ResGet = {
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

    const {data, error, count} = await supabase
      .from(table)
      .select([...config.columns || ''].join(', '), {count: config.count || 'exact'})
      .match(config.eq || {});

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