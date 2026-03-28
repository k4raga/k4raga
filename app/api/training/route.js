export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CS_URL      = process.env.CS_APP_URL      || 'http://localhost:3001'
const VOICE_URL   = process.env.VOICE_APP_URL   || 'http://localhost:3002'
const ROUTINE_URL = process.env.ROUTINE_APP_URL || 'http://localhost:3003'

export async function GET() {
  const [csRes, voiceRes, routineRes] = await Promise.all([
    fetch(`${CS_URL}/api/training`,      { cache: 'no-store' }).then(r => r.json()).catch(() => ({})),
    fetch(`${VOICE_URL}/api/training`,   { cache: 'no-store' }).then(r => r.json()).catch(() => ({})),
    fetch(`${ROUTINE_URL}/api/training`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({})),
  ])

  const result = {}
  const allDates = new Set([...Object.keys(csRes), ...Object.keys(voiceRes), ...Object.keys(routineRes)])
  for (const date of allDates) {
    result[date] = {
      cs:       csRes[date]?.done      || false,
      voice:    voiceRes[date]?.done   || false,
      routine:  routineRes[date]?.done || false,
      cs_tasks: csRes[date]?.cs_tasks  || []
    }
  }
  return Response.json(result)
}
