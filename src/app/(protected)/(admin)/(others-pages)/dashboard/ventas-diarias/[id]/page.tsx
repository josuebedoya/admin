'use client'

import {useParams} from "next/navigation"

export default function SalePage() {
  const params = useParams()

  return <p>Venta: {params.id}</p>
}