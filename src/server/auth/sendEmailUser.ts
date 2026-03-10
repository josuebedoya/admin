import { createAuthClient } from "@/server/auth/client";
import ResApi from "@/server/resApi";

type Params = {
  email: string;
}

const url = process.env.NEXT_PUBLIC_SITE_URL;

const signIn = async ({email}: Params) => {

  try {
    if (!email) {
      return ResApi({
        data: null,
        success: false,
        message: 'EMAIL_REQUIRED',
        error: 'Missing email',
        status: 400
      })
    }

    const supabase = await createAuthClient();
    const {data, error} = await supabase.auth.resetPasswordForEmail(email,
      {
        redirectTo: `${url}/reset-password`
      }
    );

    if (error) {
      console.error('Error sending email:', error.message)
      return ResApi({
        data: null,
        success: false,
        message: error.code || 'SEND_EMAIL_FAILED',
        error: error.message,
        status: 401
      });
    }

    return ResApi({
      data,
      success: true,
      message: 'SEND_EMAIL_SUCCESS',
      error: null,
      status: 200
    });

  } catch (error) {
    console.error('Error sending email', error instanceof Error ? error.message : error)
    return ResApi({
      data: null,
      success: false,
      message: 'SEND_EMAIL_FAILED',
      error: error instanceof Error ? error.message : error,
      status: 500
    });
  }
}

export default signIn;