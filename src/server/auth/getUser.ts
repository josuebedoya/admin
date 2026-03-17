"use server";

import ResApi from "@/server/resApi";
import { createAuthClient } from "@/server/auth/client";

const getUser = async () => {
  try {
    const supabase = await createAuthClient();

    const {data, error} = await supabase.auth.getUser();

    if (error) {
      // Manejar caso de "sin sesión" como éxito con usuario nulo
      if (error.message.includes("Auth session missing")) {
        return ResApi({
          data: { user: null },
          success: true,
          message: 'NO_SESSION',
          error: null,
          status: 200
        });
      }

      console.error('Error getting session:', error.message)
      return ResApi({
        data: null,
        success: false,
        message: error.code || 'GET_USER_FAILED',
        error: error.message,
        status: 401
      });
    }

    return ResApi({
      data,
      success: true,
      message: 'GET_USER_SUCCESS',
      error: error,
      status: 200
    });

  } catch (error) {
    console.error('Error getting session:', error instanceof Error ? error.message : error)
    return ResApi({
      data: null,
      success: false,
      message: 'GET_USER_ERROR',
      error: error instanceof Error ? error.message : error,
      status: 500
    });
  }
}

export default getUser;