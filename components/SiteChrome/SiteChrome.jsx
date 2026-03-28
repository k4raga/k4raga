'use client'
import { usePathname } from 'next/navigation'
import Background from '@/components/Background/Background'
import Topbar from '@/components/Topbar/Topbar'

export default function SiteChrome() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  return (
    <>
      <Background />
      <Topbar />
    </>
  )
}
