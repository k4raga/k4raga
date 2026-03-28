'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Popup from '@/components/Popup/Popup'
import './page.css'

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || 'https://k4raga.ru'

const ICONS = [
  <svg viewBox="0 0 32 32" fill="none" stroke="#D40000" strokeWidth="2" strokeLinecap="square"><line x1="16" y1="2" x2="16" y2="12"/><line x1="16" y1="20" x2="16" y2="30"/><line x1="2" y1="16" x2="12" y2="16"/><line x1="20" y1="16" x2="30" y2="16"/><rect x="12" y="12" width="8" height="8"/></svg>,
  <svg viewBox="0 0 32 32" fill="none" stroke="#D40000" strokeWidth="2" strokeLinecap="square"><rect x="5" y="5" width="22" height="22"/><line x1="12" y1="11" x2="12" y2="21"/><line x1="20" y1="11" x2="20" y2="21"/></svg>,
  <svg viewBox="0 0 32 32" fill="none" stroke="#D40000" strokeWidth="2" strokeLinecap="square"><path d="M4 12h18l2 2v4h-6v6h-4v-6H4z"/><line x1="8" y1="12" x2="8" y2="8"/><rect x="22" y="10" width="6" height="4"/></svg>,
  <svg viewBox="0 0 32 32" fill="none" stroke="#D40000" strokeWidth="2" strokeLinecap="square"><path d="M4 24l6-4 6 2 6-6 6 2"/><circle cx="8" cy="8" r="2" fill="#D40000"/><circle cx="14" cy="6" r="1.5" fill="#D40000"/><circle cx="11" cy="11" r="1.5" fill="#D40000"/><circle cx="16" cy="12" r="2" fill="#D40000"/><circle cx="20" cy="9" r="1" fill="#D40000"/></svg>,
  <svg viewBox="0 0 32 32" fill="none" stroke="#D40000" strokeWidth="2" strokeLinecap="square"><circle cx="16" cy="16" r="11"/><line x1="16" y1="1" x2="16" y2="10"/><line x1="16" y1="22" x2="16" y2="31"/><line x1="1" y1="16" x2="10" y2="16"/><line x1="22" y1="16" x2="31" y2="16"/></svg>,
  <svg viewBox="0 0 32 32" fill="none" stroke="#D40000" strokeWidth="2" strokeLinecap="square"><rect x="2" y="8" width="28" height="16" rx="3"/><rect x="8" y="13" width="6" height="6"/><circle cx="22" cy="14" r="1.5" fill="#D40000"/><circle cx="22" cy="19" r="1.5" fill="#D40000"/><circle cx="19" cy="16.5" r="1.5" fill="#D40000"/><circle cx="25" cy="16.5" r="1.5" fill="#D40000"/></svg>,
]

const MONTH_SHORT = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']
const MONTH_FULL  = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']
const WEEK = ['пн','вт','ср','чт','пт','сб','вс']

function toDateStr(y, m, d) {
  return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0')
}

function formatDisplay(dateStr) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-').map(Number)
  return d + ' ' + MONTH_FULL[m - 1] + ' ' + y
}

function DatePicker({ dateKey, history, onChange }) {
  const today = new Date()
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  const [open, setOpen] = useState(false)
  const [year, setYear]   = useState(() => dateKey ? Number(dateKey.split('-')[0]) : today.getFullYear())
  const [month, setMonth] = useState(() => dateKey ? Number(dateKey.split('-')[1]) - 1 : today.getMonth())
  const ref = useRef(null)

  useEffect(() => {
    if (dateKey) {
      setYear(Number(dateKey.split('-')[0]))
      setMonth(Number(dateKey.split('-')[1]) - 1)
    }
  }, [dateKey])

  useEffect(() => {
    if (!open) return
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  function prevMonth() { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  function nextMonth() { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const firstDay   = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = (firstDay + 6) % 7 // Mon-first

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="cs-datepicker" ref={ref}>
      <button className="cs-date-btn" onClick={() => setOpen(o => !o)}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
          <rect x="1" y="2" width="14" height="13" rx="1"/><line x1="1" y1="6" x2="15" y2="6"/><line x1="5" y1="1" x2="5" y2="4"/><line x1="11" y1="1" x2="11" y2="4"/>
        </svg>
        <span>{formatDisplay(dateKey)}</span>
        <span className="cs-date-arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="cs-cal-dropdown">
          <div className="cs-cal-nav">
            <button className="cs-cal-nav-btn" onClick={prevMonth}>‹</button>
            <span className="cs-cal-nav-label">{MONTH_SHORT[month]} {year}</span>
            <button className="cs-cal-nav-btn" onClick={nextMonth}>›</button>
          </div>
          <div className="cs-cal-week">
            {WEEK.map(w => <span key={w}>{w}</span>)}
          </div>
          <div className="cs-cal-grid">
            {cells.map((d, i) => {
              if (!d) return <span key={i} className="cs-cal-empty" />
              const ds = toDateStr(year, month, d)
              const isToday    = ds === todayStr
              const isSelected = ds === dateKey
              const isDone     = history[ds]?.done
              const hasRecord  = ds in history
              return (
                <button key={i} onClick={() => { onChange(ds); setOpen(false) }}
                  className={
                    'cs-cal-day' +
                    (isSelected ? ' selected' : '') +
                    (isToday    ? ' today'    : '') +
                    (isDone     ? ' done'     : '') +
                    (hasRecord && !isDone ? ' partial' : '')
                  }>
                  {d}
                  {hasRecord && <span className="cs-cal-dot" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function pickRandom(exercises) {
  return exercises.map(ex => {
    const options = ex.hint.split(',').map(s => s.trim()).filter(Boolean)
    return options[Math.floor(Math.random() * options.length)]
  })
}

function CSTrainingContent() {
  const searchParams = useSearchParams()
  const [exercises, setExercises] = useState([])
  const [checked,   setChecked]   = useState([])
  const [selected,  setSelected]  = useState([])
  const [dateKey,   setDateKey]   = useState(null)
  const [history,   setHistory]   = useState({})
  const [popup,     setPopup]     = useState(false)

  const done  = checked.filter(Boolean).length
  const total = exercises.length

  useEffect(() => {
    fetch('/api/exercises').then(r => r.json()).then(exs => {
      setExercises(exs)
      setChecked(exs.map(() => false))
    }).catch(() => {})
    fetch('/api/training').then(r => r.json()).then(setHistory).catch(() => {})
  }, [])

  useEffect(() => {
    if (exercises.length === 0) return
    const paramDate = searchParams.get('date')
    const shouldReset = searchParams.get('reset') === '1'
    const resolveKey = paramDate
      ? Promise.resolve(paramDate)
      : fetch('/api/date').then(r => r.json()).then(d => d.date).catch(() => {
          const n = new Date()
          return n.getFullYear() + '-' + String(n.getMonth()+1).padStart(2,'0') + '-' + String(n.getDate()).padStart(2,'0')
        })

    resolveKey.then(key => {
      setDateKey(key)
      if (shouldReset) {
        const rand = pickRandom(exercises)
        setChecked(exercises.map(() => false))
        setSelected(rand)
        fetch('/api/training/' + key, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ done: false, cs_tasks: [], cs_selected: rand })
        })
        return
      }
      return fetch('/api/training/' + key).then(r => r.json())
    }).then(data => {
      if (!data) return
      const saved = data.cs_tasks || []
      setChecked(exercises.map((_, i) => !!saved[i]))
      const savedSel = data.cs_selected || []
      setSelected(savedSel.length ? savedSel : pickRandom(exercises))
    }).catch(() => {})
  }, [searchParams, exercises])

  function loadDate(key) {
    setDateKey(key)
    setPopup(false)
    window.history.replaceState(null, '', '/training?date=' + key)
    fetch('/api/training/' + key).then(r => r.json()).then(data => {
      const saved = data.cs_tasks || []
      setChecked(exercises.map((_, i) => !!saved[i]))
      const savedSel = data.cs_selected || []
      setSelected(savedSel.length ? savedSel : pickRandom(exercises))
    }).catch(() => {
      setChecked(exercises.map(() => false))
      setSelected(pickRandom(exercises))
    })
  }

  function toggle(i) {
    const next = checked.map((v, j) => j === i ? !v : v)
    setChecked(next)
    const allDone = next.every(Boolean)
    if (allDone) setPopup(true)
    if (dateKey) {
      setHistory(h => ({ ...h, [dateKey]: { done: allDone, cs_tasks: next } }))
      fetch('/api/training/' + dateKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: allDone, cs_tasks: next, cs_selected: selected })
      })
    }
  }

  function reset() {
    const rand = pickRandom(exercises)
    setChecked(exercises.map(() => false))
    setSelected(rand)
    if (dateKey) {
      setHistory(h => ({ ...h, [dateKey]: { done: false, cs_tasks: [] } }))
      fetch('/api/training/' + dateKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: false, cs_tasks: [], cs_selected: rand })
      })
    }
  }

  const backHref = dateKey ? `${HUB_URL}/day/${dateKey}` : HUB_URL

  return (
    <div className="cs-page">
      <nav className="cs-topbar">
        <a href={HUB_URL} className="cs-topbar-logo">
          <img src="/logo.jpg" alt="K4RAGA" className="cs-topbar-img" />
          K4RAGA
        </a>
        <span className="cs-topbar-title">CS ТРЕНИРОВКА</span>
      </nav>

      <div className="cs-header">
        <h1>CS Тренировка</h1>
        <p>Выполни все задачи перед каткой</p>
        <DatePicker dateKey={dateKey} history={history} onChange={loadDate} />
        <div className="cs-progress-wrap">
          <div className="cs-progress-bar" style={{ width: (done / total * 100) + '%' }} />
        </div>
        <div className="cs-progress-text">{done} / {total}</div>
      </div>

      <div className="cs-task-list">
        {exercises.map((task, i) => (
          <label key={task.id} className={'cs-task' + (checked[i] ? ' done' : '')} onClick={() => toggle(i)}>
            <div className="cs-task-number">
              {checked[i] ? null : <span>{task.num}</span>}
            </div>
            <div className="cs-task-info">
              <div className="cs-task-name">{task.name}</div>
              {selected[i] && (
                <div className="cs-task-selected">{selected[i]}</div>
              )}
            </div>
            <div className="cs-task-icon">{ICONS[i]}</div>
          </label>
        ))}
      </div>

      {exercises.length > 0 && checked.every(Boolean) && (
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
        desc={<>CS тренировка завершена —<br/>возвращайся к дню</>}
        backHref={backHref}
        onClose={() => setPopup(false)} />
    </div>
  )
}

export default function CSTraining() {
  return (
    <Suspense fallback={<div className="cs-page" />}>
      <CSTrainingContent />
    </Suspense>
  )
}
