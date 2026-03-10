import supabase from "@/server/client";
import ResApi from "@/server/resApi";

type Params = {
  table: string;
  data: Record<string, any>;
  eq?: {
    [key: string]: string | number | boolean;
  };
  returning?: boolean; // Si queremos que retorne los datos actualizados
}

export type updateParams = Omit<Params, 'table'>;

export type ResUpdate = {
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

const update = async ({ table, data, eq = {}, returning = true }: Params): Promise<ResUpdate> => {

  try {
    const query = supabase
      .from(table)
      .update(data)
      .match(eq);

    // Ejecutar con o sin select según el parámetro returning
    const { data: updatedData, error } = returning 
      ? await query.select()
      : await query;

    if (error) {
      console.error('Error trying to update data in table: ', table, error.message)
      return ResApi({
        data: nullData,
        success: false,
        message: error.code || 'UPDATE_DATA_FAILED',
        error: error.message,
        status: 400
      });
    }

    return ResApi({
      data: {
        items: updatedData || []
      },
      success: true,
      message: 'UPDATE_DATA_SUCCESS',
      error: error,
      status: 200
    });

  } catch (error) {
    console.error('Error trying to update data in table: ', table, error instanceof Error ? error.message : error)
    return ResApi({
      data: nullData,
      success: false,
      message: 'UPDATE_DATA_ERROR',
      error: error instanceof Error ? error.message : error,
      status: 500
    });
  }
}

export default update;
