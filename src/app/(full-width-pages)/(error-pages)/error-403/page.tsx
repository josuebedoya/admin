import GridShape from "@/components/common/GridShape";
import {Metadata} from "next";
import Image from "next/image";
import {createAuthClient} from "@/server/auth/client";
import {redirect} from "next/navigation";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acceso Restringido - Admin",
  description: "Lo sentimos, no tienes permisos suficientes para acceder a esta área.",
};

export default async function Forbidden403() {
  const supabase = await createAuthClient();
  const {data: {user}} = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1 bg-white dark:bg-gray-900">
      <GridShape/>
      <div className="mx-auto w-full max-w-[472px] text-center">
        <h1 className="mb-4 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
          PERMISO DENEGADO
        </h1>

        <div className="relative w-full h-64 mb-8">
          <Image
            src="/images/error/404.svg"
            alt="403 Forbidden"
            className="dark:hidden object-contain"
            fill
          />
          <Image
            src="/images/error/404-dark.svg"
            alt="403 Forbidden"
            className="hidden dark:block object-contain"
            fill
          />
        </div>

        <p className="mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
          Hola <strong>{user?.user_metadata?.name || user?.email}</strong>,<br/>
          Actualmente estás logueado como <strong>Espectador</strong>.
        </p>

        <p className="mb-10 text-sm text-gray-500 dark:text-gray-500">
          Esta sección del panel de administración está reservada únicamente para administradores.
          Si necesitas acceso, por favor contacta al administrador del sistema.
        </p>

        <div className="flex flex-col gap-4 justify-center sm:flex-row">
          <form action={async () => {
            "use server";
            const sb = await createAuthClient();
            await sb.auth.signOut();
            redirect("/signin");
          }}>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              Cerrar Sesión
            </button>
          </form>
          <Link
            href="/"
            className="w-full max-w-max inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Volver al inicio
          </Link>
        </div>
      </div>

      <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
        &copy; {new Date().getFullYear()} - Admin Dashboard
      </p>
    </div>
  );
}
