'use client'
import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const VOICE_URL = process.env.NEXT_PUBLIC_VOICE_URL || 'https://voice.k4raga.ru'

function Redirect() {
  const searchParams = useSearchParams()
  useEffect(() => {
    const date = searchParams.get('date')
    window.location.replace(date ? `${VOICE_URL}/?date=${date}` : VOICE_URL)
  }, [searchParams])
  return null
}

export default function VoiceRedirect() {
  return (
    <Suspense fallback={null}>
      <Redirect />
    </Suspense>
  )
}
