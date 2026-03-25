"use server";

import { createAuthClient } from "@/server/auth/client";
import getUsers from "./getUsers";
import ResApi from "@/server/resApi";

/**
 * Roles permitidos para realizar acciones (editar, eliminar, crear)
 * role_id = 1 es administrador
 */
const ADMIN_ROLE_ID = 1;

export async function checkAdminPermission() {
  try {
    const supabase = await createAuthClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        hasPermission: false,
        error: "No autenticado",
        status: 401
      };
    }

    // Obtener datos del usuario con su rol
    const { data, error, message } = await getUsers({
      eq: { id: user.id },
      getAll: true
    });

    if (error || !data.items || data.items.length === 0) {
      return {
        hasPermission: false,
        error: "Usuario no encontrado",
        status: 404
      };
    }

    const userData = data.items[0];
    const hasPermission = userData.role_id === ADMIN_ROLE_ID;

    return {
      hasPermission,
      roleId: userData.role_id,
      roleName: userData.role,
      userId: user.id,
      error: hasPermission ? null : "Permiso denegado",
      status: hasPermission ? 200 : 403
    };

  } catch (error) {
    return {
      hasPermission: false,
      error: error instanceof Error ? error.message : "Error verificando permisos",
      status: 500
    };
  }
}

export async function requireAdminPermission() {
  const { hasPermission, error, status } = await checkAdminPermission();

  if (!hasPermission) {
    return ResApi({
      data: null,
      success: false,
      message: "PERMISSION_DENIED",
      error: error,
      status: status
    });
  }

  return { success: true };
}

