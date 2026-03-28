export async function getDate() {
  const r = await fetch('/api/date')
  return r.json()
}

export async function getAllTraining() {
  const r = await fetch('/api/training')
  return r.json()
}

export async function getTraining(date) {
  const r = await fetch('/api/training/' + date)
  return r.json()
}

export async function saveTraining(date, patch) {
  await fetch('/api/training/' + date, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  })
}
