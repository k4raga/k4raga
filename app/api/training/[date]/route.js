export const runtime = 'nodejs'

const CS_URL    = process.env.CS_APP_URL    || 'http://localhost:3001'
const VOICE_URL = process.env.VOICE_APP_URL || 'http://localhost:3002'

export async function GET(req, { params }) {
  const { date } = params
  const [csData, voiceData] = await Promise.all([
    fetch(`${CS_URL}/api/training/${date}`).then(r => r.json()).catch(() => ({ done: false, cs_tasks: [] })),
    fetch(`${VOICE_URL}/api/training/${date}`).then(r => r.json()).catch(() => ({ done: false }))
  ])
  return Response.json({
    cs:       csData.done    || false,
    voice:    voiceData.done || false,
    cs_tasks: csData.cs_tasks || []
  })
}
