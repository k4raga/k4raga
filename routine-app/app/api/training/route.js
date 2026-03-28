export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import getDb from '@/lib/db'

export function GET() {
  const db = getDb()
  const rows = db.prepare('SELECT date, done FROM training').all()
  const result = {}
  for (const row of rows) result[row.date] = { done: Boolean(row.done) }
  return Response.json(result)
}
