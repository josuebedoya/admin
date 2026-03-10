import { createAuthClient } from "@/server/auth/client";
import ResApi from "@/server/resApi";

const signOut = async () => {
  try {
    const supabase = await createAuthClient();
    const {error} = await supabase.auth.signOut();


    if (error) {
      console.error('Error signing out:', error.message);
      return ResApi({
        data: null,
        success: !error,
        message: 'SIGN_OUT_ERROR',
        error: error ? error.message : null,
        status: 401
      });
    }

    return ResApi({
      data: null,
      success: true,
      message: '',
      error,
      status: 200
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error signing out:', errorMessage);
    return ResApi({
        data: null,
        success: false,
        message: 'SIGN_OUT_ERROR',
        error: errorMessage,
        status: 500
      }
    )
  }
}

export default signOut;