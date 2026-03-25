"use server";

import {redirect} from "next/navigation";
import {createAuthClient} from "@/server/auth/client";
import getUsers from "@/server/auth/getUsers";

export async function requireAdmin() {
  const supabase = await createAuthClient();

  const {
    data: {user},
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/signin");
  }

  // Usamos getUsers para traer la info del perfil, incluyendo role_id
  const {data, error} = await getUsers({
    eq: {id: user.id},
    getAll: true
  });

  const currentUser = data?.items?.[0];

  // Si no hay usuario, error, o role_id no es 1, redirigir a 403 (o home si prefieres)
  if (error || !currentUser || currentUser.role_id !== 1) {
    // Asumiendo que existe una página de error o redirigimos al home
    // console.log("Acceso denegado a admin:", currentUser);
    redirect("/error-403");
  }

  return currentUser;
}
