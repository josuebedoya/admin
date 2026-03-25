"use server";

import ResApi from "@/server/resApi";
import {createAuthClient} from "@/server/auth/client";
import {revalidatePath} from "next/cache";

interface UpdateUserProfileParams {
  firstName: string;
  lastName: string;
  phone: string;
}

export async function updateUserProfile({firstName, lastName, phone}: UpdateUserProfileParams) {
  try {
    const supabase = await createAuthClient();
    const {data: {user}, error: userError} = await supabase.auth.getUser();

    if (userError || !user) {
      return ResApi({
        data: null,
        success: false,
        message: "No autenticado",
        error: userError?.message,
        status: 401
      });
    }

    // 1. Actualizar metadata del usuario (nombre y apellido)
    const {error: updateAuthError} = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`.trim(),
        full_name: `${firstName} ${lastName}`.trim(),
        phone: phone
      }
    });

    if (updateAuthError) {
      return ResApi({
        data: null,
        success: false,
        message: "Error actualizando auth metadata",
        error: updateAuthError.message,
        status: 500
      });
    }

    // 2. Actualizar tabla profiles
    const {error: updateProfileError} = await supabase
      .from('profiles')
      .update({name: `${firstName} ${lastName}`, phone})
      .eq('id', user.id);

    if (updateProfileError) {
      return ResApi({
        data: null,
        success: false,
        message: "Error actualizando perfil",
        error: updateProfileError.message,
        status: 500
      });
    }

    revalidatePath("/profile");
    revalidatePath("/", "layout");

    return ResApi({
      data: null,
      error: null,
      success: true,
      message: "Perfil actualizado correctamente",
      status: 200
    });

  } catch (error) {
    return ResApi({
      data: null,
      success: false,
      message: "Error en el servidor",
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500
    });
  }
}

