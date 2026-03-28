export const runtime = 'nodejs'
import getDb from '@/lib/db'

export function GET() {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM training').all()
  const result = {}
  for (const row of rows) {
    result[row.date] = {
      done:     Boolean(row.done),
      cs_tasks: JSON.parse(row.cs_tasks || '[]')
    }
  }
  return Response.json(result)
}
