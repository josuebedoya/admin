import SignUpForm from "@/components/auth/SignUpForm";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Regístrate - Admin",
  description: "Registrate y comienza a gestionar tu inventario de manera eficiente",
};

export default function SignUp() {
  return <SignUpForm/>;
}
