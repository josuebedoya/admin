import {redirect} from "next/navigation"
import {createClientServer} from "@/server/server"

export const dynamic = "force-dynamic"

export default async function RootLayout({children}: { children: React.ReactNode }) {

  const supabase = await createClientServer()

  const {
    data: {user}
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }

  return children
}