import { createAuthClient } from "@/server/auth/client";
import ResApi from "@/server/resApi";

const getSession = async () => {

  try {

    const supabase = await createAuthClient();
    const {data, error} = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error.message)
      return ResApi({
        data: null,
        success: false,
        message: error.code || 'GET_SESSION_FAILED',
        error: error.message,
        status: 401
      });
    }

    return ResApi({
      data,
      success: true,
      message: 'GET_SESSION_SUCCESS',
      error: error,
      status: 200
    });

  } catch (error) {
    console.error('Error getting session:', error instanceof Error ? error.message : error)
    return ResApi({
      data: null,
      success: false,
      message: 'GET_SESSION_ERROR',
      error: error instanceof Error ? error.message : error,
      status: 500
    });
  }
}

export default getSession;