export const runtime = 'nodejs'
import getDb from '@/lib/db'

export function GET(_req, { params }) {
  const { date } = params
  const db = getDb()
  const row = db.prepare('SELECT * FROM training WHERE date = ?').get(date)
  if (row) {
    return Response.json({
      done:        Boolean(row.done),
      cs_tasks:    JSON.parse(row.cs_tasks    || '[]'),
      cs_selected: JSON.parse(row.cs_selected || '[]'),
    })
  }
  return Response.json({ done: false, cs_tasks: [], cs_selected: [] })
}

export function DELETE(_req, { params }) {
  const { date } = params
  const db = getDb()
  db.prepare('DELETE FROM training WHERE date = ?').run(date)
  return Response.json({ ok: true })
}

export async function POST(req, { params }) {
  const { date } = params
  const data = await req.json()
  const db = getDb()
  db.prepare(`
    INSERT INTO training (date, done, cs_tasks, cs_selected)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET
      done        = COALESCE(excluded.done,        done),
      cs_tasks    = COALESCE(excluded.cs_tasks,    cs_tasks),
      cs_selected = COALESCE(excluded.cs_selected, cs_selected)
  `).run(
    date,
    'done'        in data ? (data.done ? 1 : 0)                : null,
    'cs_tasks'    in data ? JSON.stringify(data.cs_tasks)       : null,
    'cs_selected' in data ? JSON.stringify(data.cs_selected)    : null,
  )
  return Response.json({ ok: true })
}
