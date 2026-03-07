'use client'

import {useParams} from "next/navigation"

export default function ShelfPage() {
  const params = useParams()

  return <p>Estanteria: {params.id}</p>
}