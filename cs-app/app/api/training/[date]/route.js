export const runtime = 'nodejs'
import getDb from '@/lib/db'

export function GET(req, { params }) {
  const { date } = params
  const db = getDb()
  const row = db.prepare('SELECT * FROM training WHERE date = ?').get(date)
  if (row) {
    return Response.json({
      done:     Boolean(row.done),
      cs_tasks: JSON.parse(row.cs_tasks || '[]')
    })
  }
  return Response.json({ done: false, cs_tasks: [] })
}

export async function POST(req, { params }) {
  const { date } = params
  const data = await req.json()
  const db = getDb()
  db.prepare(`
    INSERT INTO training (date, done, cs_tasks)
    VALUES (?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET
      done     = COALESCE(excluded.done,     done),
      cs_tasks = COALESCE(excluded.cs_tasks, cs_tasks)
  `).run(
    date,
    'done'     in data ? (data.done ? 1 : 0)             : null,
    'cs_tasks' in data ? JSON.stringify(data.cs_tasks)    : null
  )
  return Response.json({ ok: true })
}
