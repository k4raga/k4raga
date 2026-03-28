export const runtime = 'nodejs'
import getDb from '@/lib/db'

export function GET(_req, { params }) {
  const { date } = params
  const db = getDb()
  const row = db.prepare('SELECT done, tasks FROM training WHERE date = ?').get(date)
  return Response.json({
    done:  row ? Boolean(row.done) : false,
    tasks: row ? JSON.parse(row.tasks || '[]') : [],
  })
}

export async function POST(req, { params }) {
  const { date } = params
  const data = await req.json()
  const db = getDb()
  db.prepare(`
    INSERT INTO training (date, done, tasks) VALUES (?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET
      done  = COALESCE(excluded.done,  done),
      tasks = COALESCE(excluded.tasks, tasks)
  `).run(
    date,
    'done'  in data ? (data.done ? 1 : 0)          : null,
    'tasks' in data ? JSON.stringify(data.tasks)    : null,
  )
  return Response.json({ ok: true })
}

export function DELETE(_req, { params }) {
  const { date } = params
  const db = getDb()
  db.prepare('DELETE FROM training WHERE date = ?').run(date)
  return Response.json({ ok: true })
}
