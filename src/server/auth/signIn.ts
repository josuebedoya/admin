import { createAuthClient } from "@/server/auth/client";
import ResApi from "@/server/resApi";

type Params = {
  email: string;
  password: string;
}

const signIn = async ({email, password}: Params) => {

  try {
    if (!email || !password) {
      return ResApi({
        data: null,
        success: false,
        message: 'EMAIL_AND_PASSWORD_REQUIRED',
        error: 'Missing email or password',
        status: 400
      })
    }

    const supabase = await createAuthClient();
    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Error signing in:', error.message)
      return ResApi({
        data: null,
        success: false,
        message: error.code || 'SIGN_IN_FAILED',
        error: error.message,
        status: 401
      });
    }

    return ResApi({
      data,
      success: true,
      message: 'SIGN_IN_SUCCESS',
      error: null,
      status: 200
    });

  } catch (error) {
    console.error('Error signing in:', error instanceof Error ? error.message : error)
    return ResApi({
      data: null,
      success: false,
      message: 'SIGN_IN_ERROR',
      error: error instanceof Error ? error.message : error,
      status: 500
    });
  }
}

export default signIn;