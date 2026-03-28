import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import getDb from '@/lib/db'

function checkAuth() {
  const store = cookies()
  return store.get('admin_auth')?.value === 'k4raga_cs_admin_2026'
}

export async function GET() {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const rows = db.prepare('SELECT * FROM training ORDER BY date DESC').all()
  return NextResponse.json(rows)
}

export async function DELETE(req) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { date } = await req.json()
  const db = getDb()
  db.prepare('DELETE FROM training WHERE date = ?').run(date)
  return NextResponse.json({ ok: true })
}
