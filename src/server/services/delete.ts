import supabase from "@/server/client";
import ResApi from "@/server/resApi";

type ParamsDeleteCommon = {
  column?: string;
  eq?: {
    [key: string]: string | number | boolean | string[] | number[] | boolean[];
  };
}

type Params = ParamsDeleteCommon & {
  table: string;
}

export type ResDelete = {
  data: {
    items: any[];
  };
  error: string | null;
  success: boolean;
  message: string;
}

const nullData = {
  items: []
}

const Delete = async ({table, ...config}: Params): Promise<ResDelete> => {

  try {
    let query = supabase
      .from(table)
      .delete()

    query = query.match(config.eq || {});
    query.select();

    const {data, error, count} = await query;

    if (error) {
      console.error('Error trying delete data from table:', table, error.message)
      return ResApi({
        data: nullData,
        success: false,
        message: error.code || 'DELETE_DATA_FAILED',
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
      message: 'DELETE_DATA_SUCCESS',
      error: error,
      status: 200
    });

  } catch (error) {
    console.error('Error trying delete data from table:', table, error instanceof Error ? error.message : error)
    return ResApi({
      data: nullData,
      success: false,
      message: 'DELETE_DATA_ERROR',
      error: error instanceof Error ? error.message : error,
      status: 500
    });
  }
}

export default Delete;