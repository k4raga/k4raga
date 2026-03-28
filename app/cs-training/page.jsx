'use client'
import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const CS_URL = process.env.NEXT_PUBLIC_CS_URL || 'https://cs.k4raga.ru'

function Redirect() {
  const searchParams = useSearchParams()
  useEffect(() => {
    const date = searchParams.get('date')
    window.location.replace(date ? `${CS_URL}/?date=${date}` : CS_URL)
  }, [searchParams])
  return null
}

export default function CSRedirect() {
  return (
    <Suspense fallback={null}>
      <Redirect />
    </Suspense>
  )
}
