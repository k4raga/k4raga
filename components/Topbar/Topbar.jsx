'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import logo from '@/lib/logo.js'
import './Topbar.css'

export default function Topbar() {
  const path = usePathname()

  return (
    <nav className="topbar">
      <Link href="/" className="topbar-left">
        <img className="topbar-logo" src={logo} alt="K4RAGA" />
        <span className="topbar-name">K4RAGA</span>
      </Link>
      <div className="topbar-nav">
        <Link href="/"               className={'topbar-link' + (path === '/'               ? ' active' : '')}>Hub</Link>
        <Link href="/cs-training"    className={'topbar-link' + (path === '/cs-training'    ? ' active' : '')}>CS</Link>
        <Link href="/voice-training" className={'topbar-link' + (path === '/voice-training' ? ' active' : '')}>Голос</Link>
      </div>
    </nav>
  )
}
