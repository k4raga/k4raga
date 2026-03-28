import { NextResponse } from 'next/server'

export async function POST(req) {
  const { login, password } = await req.json()
  if (login === 'admin' && password === 'admin') {
    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_auth', 'k4raga_voice_admin_2026', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })
    return res
  }
  return NextResponse.json({ ok: false }, { status: 401 })
}
