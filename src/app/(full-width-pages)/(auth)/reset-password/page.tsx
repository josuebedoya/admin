'use client'

import {useEffect, useState} from "react"
import { getSessionAction } from "@/server/auth/actions";
import Alert from "@/components/ui/alert/Alert";
import SendEmailForm from "@/components/auth/SendEmailForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {

  const [loading, setLoading] = useState(true)
  const [expired, setExpired] = useState(false)

  useEffect(() => {

    const init = async () => {

      const {data} = await getSessionAction()

      if (!data.session) {
        setExpired(true)

      }

      setLoading(false)
    }

    init()

  }, [])

  if (loading) return null

  if (expired) {
    return (
      <div className='flex flex-col lg:flex-row items-center justify-center gap-10'>
        <Alert
          variant="error"
          title="Link expirado o inválido"
          message="El enlace de recuperación ya no es válido. Solicita uno nuevo."
        />
        <SendEmailForm/>
      </div>
    )
  }

  return <ResetPasswordForm/>
}