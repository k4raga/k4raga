export const runtime = 'nodejs'
import getDb from '@/lib/db'

export function GET(req, { params }) {
  const { date } = params
  const db = getDb()
  const row = db.prepare('SELECT * FROM training WHERE date = ?').get(date)
  if (row) return Response.json({ done: Boolean(row.done) })
  return Response.json({ done: false })
}

export async function POST(req, { params }) {
  const { date } = params
  const data = await req.json()
  const db = getDb()
  db.prepare(`
    INSERT INTO training (date, done)
    VALUES (?, ?)
    ON CONFLICT(date) DO UPDATE SET
      done = COALESCE(excluded.done, done)
  `).run(
    date,
    'done' in data ? (data.done ? 1 : 0) : null
  )
  return Response.json({ ok: true })
}
