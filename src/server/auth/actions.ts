'use server';

import { createAuthClient } from "@/server/auth/client";
import ResApi from "@/server/resApi";
import { redirect } from 'next/navigation';

type SignInParams = {
  email: string;
  password: string;
}

type SignUpParams = {
  email: string;
  password: string;
  name: string;
}

export async function signInAction({ email, password }: SignInParams) {
  try {
    if (!email || !password) {
      return ResApi({
        data: null,
        success: false,
        message: 'EMAIL_AND_PASSWORD_REQUIRED',
        error: 'Missing email or password',
        status: 400
      });
    }

    const supabase = await createAuthClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error.message);
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
    console.error('Error signing in:', error instanceof Error ? error.message : error);
    return ResApi({
      data: null,
      success: false,
      message: 'SIGN_IN_ERROR',
      error: error instanceof Error ? error.message : String(error),
      status: 500
    });
  }
}

export async function signOutAction() {
  try {
    const supabase = await createAuthClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error.message);
      return ResApi({
        data: null,
        success: false,
        message: 'SIGN_OUT_ERROR',
        error: error.message,
        status: 401
      });
    }

    return ResApi({
      data: null,
      success: true,
      message: 'SIGN_OUT_SUCCESS',
      error: null,
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
    });
  }
}

export async function signUpAction({ email, password, name }: SignUpParams) {
  try {
    if (!email || !password || !name) {
      return ResApi({
        data: null,
        success: false,
        message: 'DATA_REQUIRED',
        error: 'Missing some required data',
        status: 400
      });
    }

    const supabase = await createAuthClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    if (error) {
      console.error('Error signing up user:', error.message);
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
    console.error('Error signing up user:', error instanceof Error ? error.message : error);
    return ResApi({
      data: null,
      success: false,
      message: 'SIGN_UP_ERROR',
      error: error instanceof Error ? error.message : String(error),
      status: 500
    });
  }
}

export async function getSessionAction() {
  try {
    const supabase = await createAuthClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error.message);
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
      error: null,
      status: 200
    });

  } catch (error) {
    console.error('Error getting session:', error instanceof Error ? error.message : error);
    return ResApi({
      data: null,
      success: false,
      message: 'GET_SESSION_ERROR',
      error: error instanceof Error ? error.message : String(error),
      status: 500
    });
  }
}

export async function sendPasswordResetAction(email: string) {
  try {
    if (!email) {
      return ResApi({
        data: null,
        success: false,
        message: 'EMAIL_REQUIRED',
        error: 'Missing email',
        status: 400
      });
    }

    const url = process.env.NEXT_PUBLIC_SITE_URL;
    const supabase = await createAuthClient();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${url}/reset-password`
    });

    if (error) {
      console.error('Error sending email:', error.message);
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
    console.error('Error sending email:', error instanceof Error ? error.message : error);
    return ResApi({
      data: null,
      success: false,
      message: 'SEND_EMAIL_ERROR',
      error: error instanceof Error ? error.message : String(error),
      status: 500
    });
  }
}

export async function updatePasswordAction(password: string) {
  try {
    if (!password) {
      return ResApi({
        data: null,
        success: false,
        message: 'PASSWORD_REQUIRED',
        error: 'Missing password',
        status: 400
      });
    }

    const supabase = await createAuthClient();
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error('Error updating password:', error.message);
      return ResApi({
        data: null,
        success: false,
        message: error.code || 'UPDATE_PASSWORD_FAILED',
        error: error.message,
        status: 401
      });
    }

    return ResApi({
      data,
      success: true,
      message: 'UPDATE_PASSWORD_SUCCESS',
      error: null,
      status: 200
    });

  } catch (error) {
    console.error('Error updating password:', error instanceof Error ? error.message : error);
    return ResApi({
      data: null,
      success: false,
      message: 'UPDATE_PASSWORD_ERROR',
      error: error instanceof Error ? error.message : String(error),
      status: 500
    });
  }
}
