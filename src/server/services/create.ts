import supabase from "@/server/client";
import ResApi from "@/server/resApi";

type Params = {
  table: string;
  data: Record<string, any>;
  returning?: boolean;
}

export type createParams = Omit<Params, 'table'>;

export type ResCreate = {
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

const create = async ({table, data, returning = true}: Params): Promise<ResCreate> => {

  try {
    const {id, ...cleanData} = data as any;
    const dataToInsert = id !== undefined ? cleanData : data;

    console.log('Creating in table:', table, 'with data:', dataToInsert);

    const query = supabase
      .from(table)
      .insert(dataToInsert);

    // Ejecutar con o sin select según el parámetro returning
    const {data: insertedData, error} = returning
      ? await query.select()
      : await query;

    if (error) {
      console.error('Error trying to create data in table: ', table, error.message, error.code)
      return ResApi({
        data: nullData,
        success: false,
        message: error.code || 'CREATE_DATA_FAILED',
        error: error.message,
        status: 400
      });
    }

    return ResApi({
      data: {
        items: insertedData || []
      },
      success: true,
      message: 'CREATE_DATA_SUCCESS',
      error: error,
      status: 201
    });

  } catch (error) {
    console.error('Error trying to create data in table: ', table, error instanceof Error ? error.message : error)
    return ResApi({
      data: nullData,
      success: false,
      message: 'CREATE_DATA_ERROR',
      error: error instanceof Error ? error.message : error,
      status: 500
    });
  }
}

export default create;
