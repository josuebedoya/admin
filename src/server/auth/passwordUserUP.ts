import supabase from "@/server/client";
import ResApi from "@/server/resApi";

const PasswordUserUP = async (password: string) => {

  try {
    if (!password) {
      return ResApi({
        data: null,
        success: false,
        message: 'PASSWORD_REQUIRED',
        error: 'Missing password',
        status: 400
      })
    }

    const {data, error} = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      console.error('Error signing in:', error.message)
      return ResApi({
        data: null,
        success: false,
        message: error.code || 'UP_USER_FAILED',
        error: error.message,
        status: 401
      });
    }

    return ResApi({
      data,
      success: true,
      message: 'UP_USER_SUCCESS',
      error: null,
      status: 200
    });

  } catch (error) {
    console.error('Error signing in:', error instanceof Error ? error.message : error)
    return ResApi({
      data: null,
      success: false,
      message: 'UP_USER_ERROR',
      error: error instanceof Error ? error.message : error,
      status: 500
    });
  }
}

export default PasswordUserUP;