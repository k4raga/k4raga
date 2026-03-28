'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Popup from '@/components/Popup/Popup'
import './page.css'

const TASKS = [
  { num: '01', name: 'Постановка прицела', hint: 'Crosshair placement — держим на уровне головы',
    icon: <svg viewBox="0 0 32 32" fill="none" stroke="#D40000" strokeWidth="2" strokeLinecap="square"><line x1="16" y1="2" x2="16" y2="12"/><line x1="16" y1="20" x2="16" y2="30"/><line x1="2" y1="16" x2="12" y2="16"/><line x1="20" y1="16" x2="30" y2="16"/><rect x="12" y="12" width="8" height="8"/></svg> },
  { num: '02', name: 'Остановка на W', hint: 'Counter-strafe — мгновенная остановка перед стрельбой',
    icon: <svg viewBox="0 0 32 32" fill="none" stroke="#D40000" strokeWidth="2" strokeLinecap="square"><rect x="5" y="5" width="22" height="22"/><line x1="12" y1="11" x2="12" y2="21"/><line x1="20" y1="11" x2="20" y2="21"/></svg> },
  { num: '03', name: 'Дигл', hint: 'Desert Eagle — тренируем one-tap на дальние дистанции',
    icon: <svg viewBox="0 0 32 32" fill="none" stroke="#D40000" strokeWidth="2" strokeLinecap="square"><path d="M4 12h18l2 2v4h-6v6h-4v-6H4z"/><line x1="8" y1="12" x2="8" y2="8"/><rect x="22" y="10" width="6" height="4"/></svg> },
  { num: '04', name: 'Стреляем и ползём', hint: 'Spray transfer + движение — контроль отдачи в движении',
    icon: <svg viewBox="0 0 32 32" fill="none" stroke="#D40000" strokeWidth="2" strokeLinecap="square"><path d="M4 24l6-4 6 2 6-6 6 2"/><circle cx="8" cy="8" r="2" fill="#D40000"/><circle cx="14" cy="6" r="1.5" fill="#D40000"/><circle cx="11" cy="11" r="1.5" fill="#D40000"/><circle cx="16" cy="12" r="2" fill="#D40000"/><circle cx="20" cy="9" r="1" fill="#D40000"/></svg> },
  { num: '05', name: 'Скаут / АВП', hint: 'Снайпер — quick scope и flick shots',
    icon: <svg viewBox="0 0 32 32" fill="none" stroke="#D40000" strokeWidth="2" strokeLinecap="square"><circle cx="16" cy="16" r="11"/><line x1="16" y1="1" x2="16" y2="10"/><line x1="16" y1="22" x2="16" y2="31"/><line x1="1" y1="16" x2="10" y2="16"/><line x1="22" y1="16" x2="31" y2="16"/></svg> },
  { num: '06', name: 'Чиловая катка', hint: 'Deathmatch или casual — закрепляем всё на практике',
    icon: <svg viewBox="0 0 32 32" fill="none" stroke="#D40000" strokeWidth="2" strokeLinecap="square"><rect x="2" y="8" width="28" height="16" rx="3"/><rect x="8" y="13" width="6" height="6"/><circle cx="22" cy="14" r="1.5" fill="#D40000"/><circle cx="22" cy="19" r="1.5" fill="#D40000"/><circle cx="19" cy="16.5" r="1.5" fill="#D40000"/><circle cx="25" cy="16.5" r="1.5" fill="#D40000"/></svg> }
]

export default function CSTraining() {
  const searchParams = useSearchParams()
  const [checked, setChecked] = useState(Array(TASKS.length).fill(false))
  const [dateKey, setDateKey] = useState(null)
  const [popup, setPopup] = useState(false)

  const done = checked.filter(Boolean).length
  const total = TASKS.length

  useEffect(() => {
    const paramDate = searchParams.get('date')
    const resolveKey = paramDate
      ? Promise.resolve(paramDate)
      : fetch('/api/date').then(r => r.json()).then(d => d.date).catch(() => {
          const n = new Date()
          return n.getFullYear() + '-' + String(n.getMonth()+1).padStart(2,'0') + '-' + String(n.getDate()).padStart(2,'0')
        })

    resolveKey.then(key => {
      setDateKey(key)
      return fetch('/api/training/' + key).then(r => r.json())
    }).then(data => {
      const saved = data.cs_tasks || []
      setChecked(TASKS.map((_, i) => !!saved[i]))
    }).catch(() => {})
  }, [searchParams])

  function toggle(i) {
    const next = checked.map((v, j) => j === i ? !v : v)
    setChecked(next)
    const allDone = next.every(Boolean)
    if (allDone) setPopup(true)
    if (dateKey) {
      fetch('/api/training/' + dateKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cs: allDone, cs_tasks: next })
      })
    }
  }

  function reset() {
    setChecked(Array(TASKS.length).fill(false))
    if (dateKey) {
      fetch('/api/training/' + dateKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cs: false, cs_tasks: [] })
      })
    }
  }

  return (
    <div className="cs-page">
      <div className="cs-header">
        <h1>CS Тренировка</h1>
        <p>Выполни все задачи перед каткой</p>
        <div className="cs-progress-wrap">
          <div className="cs-progress-bar" style={{ width: (done / total * 100) + '%' }} />
        </div>
        <div className="cs-progress-text">{done} / {total}</div>
      </div>

      <div className="cs-task-list">
        {TASKS.map((task, i) => (
          <label key={i} className={'cs-task' + (checked[i] ? ' done' : '')} onClick={() => toggle(i)}>
            <div className="cs-task-number">
              {checked[i] ? null : <span>{task.num}</span>}
            </div>
            <div className="cs-task-info">
              <div className="cs-task-name">{task.name}</div>
              <div className="cs-task-hint">{task.hint}</div>
            </div>
            <div className="cs-task-icon">{task.icon}</div>
          </label>
        ))}
      </div>

      {checked.every(Boolean) && (
        <div className="cs-complete-banner show">
          <div className="cs-complete-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="square">
              <polygon points="24,4 30,18 46,18 33,28 38,44 24,34 10,44 15,28 2,18 18,18"/>
            </svg>
          </div>
          <h2>GG WP!</h2>
          <p>Тренировка завершена — ты готов к рейтингу</p>
        </div>
      )}

      <div className="cs-reset-wrap">
        <button className="cs-reset-btn" onClick={reset}>Сбросить</button>
      </div>
      <div className="cs-footer">K4RAGA © 2026</div>

      <Popup show={popup} icon="⭐" title="GG WP!"
        desc={<>CS тренировка завершена —<br/>возвращайся на главную</>}
        onClose={() => setPopup(false)} />
    </div>
  )
}
