export const runtime = 'nodejs'

export function GET() {
  const now = new Date()
  return Response.json({
    date:  now.toISOString().slice(0, 10),
    year:  now.getFullYear(),
    month: now.getMonth() + 1,
    day:   now.getDate()
  })
}
