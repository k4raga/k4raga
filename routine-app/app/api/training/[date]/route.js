export const runtime = 'nodejs'
import getDb from '@/lib/db'

export function GET(_req, { params }) {
  const { date } = params
  const db = getDb()
  const row = db.prepare('SELECT done FROM training WHERE date = ?').get(date)
  return Response.json({ done: row ? Boolean(row.done) : false })
}

export async function POST(req, { params }) {
  const { date } = params
  const { done } = await req.json()
  const db = getDb()
  db.prepare(`
    INSERT INTO training (date, done) VALUES (?, ?)
    ON CONFLICT(date) DO UPDATE SET done = excluded.done
  `).run(date, done ? 1 : 0)
  return Response.json({ ok: true })
}

export function DELETE(_req, { params }) {
  const { date } = params
  const db = getDb()
  db.prepare('DELETE FROM training WHERE date = ?').run(date)
  return Response.json({ ok: true })
}
