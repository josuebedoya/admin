import SignInForm from "@/components/auth/SignInForm";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión - Admin",
  description: "Inicia sesión en el panel de administración para gestionar tu inventario",
};

export default function SignIn() {
  return <SignInForm/>;
}
