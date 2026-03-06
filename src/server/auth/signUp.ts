import supabase from "@/server/client";
import ResApi from "@/server/resApi";

type Params = {
  email: string;
  password: string;
  name: string;
}

const signUp = async ({email, password, name}: Params) => {

  try {
    if (!email || !password || !name) {
      return ResApi({
        data: null,
        success: false,
        message: 'DATA_REQUIRED',
        error: 'Missing some required data',
        status: 400
      })
    }

    const {data, error} = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    })

    if (error) {
      console.error('Error signing up user:', error.message)
      return ResApi({
        data: null,
        success: false,
        message: error.code || 'SIGN_UP_FAILED',
        error: error.message,
        status: 401
      });
    }

    return ResApi({
      data,
      success: true,
      message: 'SIGN_UP_SUCCESS',
      error: null,
      status: 200
    });

  } catch (error) {
    console.error('Error signing up user:', error instanceof Error ? error.message : error)
    return ResApi({
      data: null,
      success: false,
      message: 'SIGN_UP_ERROR',
      error: error instanceof Error ? error.message : error,
      status: 500
    });
  }
}

export default signUp;