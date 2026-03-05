import supabaseServer from "@/server/server";
import {redirect} from "next/navigation";

export const dynamic = 'force-dynamic'
export default async function RootLayout({children}: { children: React.ReactNode }) {
  const {data: {user}} = await supabaseServer.auth.getUser()

  // Redirect doesn't exist user logged
  if (!user) {
    redirect('/signin')
  }

  return children
};
