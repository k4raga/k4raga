export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import getDb from '@/lib/db'

export function GET() {
  const db = getDb()
  const rows = db.prepare('SELECT id, num, name, hint FROM exercises WHERE active = 1 ORDER BY id').all()
  return Response.json(rows)
}
