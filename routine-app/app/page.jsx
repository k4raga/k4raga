'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import './page.css'

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || 'https://calendar.k4raga.ru'

const ICONS = [
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  <svg key="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
]

const SCHEDULE = [
  { time: '07:30', label: 'Подъем' },
  { time: '09:00', label: 'Планирование' },
  { time: '09:30', label: 'Обучение' },
  { time: '10:00', label: 'Тренажер печати' },
  { time: '10:30', label: 'Рабочий слот' },
  { time: '12:30', label: 'CS2 тренировка' },
  { time: '13:30', label: 'Рабочий слот' },
  { time: '16:40', label: 'Магазин, готовка, обед' },
  { time: '18:15', label: 'Стрим старт' },
  { time: '22:00', label: 'Демки + расскидки' },
  { time: '23:00', label: 'Конец стрима' },
  { time: '23:30', label: 'Сон' },
]

function useCountdown() {
  const [state, setState] = useState({ label: '', time: '', h: 0, m: 0, s: 0 })

  useEffect(() => {
    function calc() {
      const now = new Date()
      const nowMin = now.getHours() * 60 + now.getMinutes()
      const nowSec = nowMin * 60 + now.getSeconds()

      let next = null
      for (const item of SCHEDULE) {
        const [hh, mm] = item.time.split(':').map(Number)
        const itemSec = hh * 60 * 60 + mm * 60
        if (itemSec > nowSec) { next = { ...item, sec: itemSec }; break }
      }

      if (!next) {
        // после последней задачи — отсчет до первой задачи завтра
        const [hh, mm] = SCHEDULE[0].time.split(':').map(Number)
        const itemSec = hh * 60 * 60 + mm * 60
        const diff = (24 * 3600 - nowSec) + itemSec
        setState({
          label: SCHEDULE[0].label,
          time: SCHEDULE[0].time,
          h: Math.floor(diff / 3600),
          m: Math.floor((diff % 3600) / 60),
          s: diff % 60,
        })
        return
      }

      const diff = next.sec - nowSec
      setState({
        label: next.label,
        time: next.time,
        h: Math.floor(diff / 3600),
        m: Math.floor((diff % 3600) / 60),
        s: diff % 60,
      })
    }

    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [])

  return state
}

function RoutineContent() {
  const searchParams = useSearchParams()
  const [habits,  setHabits]  = useState([])
  const [checked, setChecked] = useState([])
  const [dateKey, setDateKey] = useState(null)
  const [popup,   setPopup]   = useState(false)
  const countdown = useCountdown()

  const done  = checked.filter(Boolean).length
  const total = habits.length
  const pct   = total ? Math.round((done / total) * 100) : 0

  useEffect(() => {
    fetch('/api/habits').then(r => r.json()).then(h => {
      setHabits(h)
      setChecked(h.map(() => false))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (habits.length === 0) return
    const paramDate = searchParams.get('date')
    const resolve = paramDate
      ? Promise.resolve(paramDate)
      : fetch('/api/date').then(r => r.json()).then(d => d.date).catch(() => {
          const n = new Date()
          return n.getFullYear() + '-' + String(n.getMonth()+1).padStart(2,'0') + '-' + String(n.getDate()).padStart(2,'0')
        })

    resolve.then(key => {
      setDateKey(key)
      return fetch('/api/training/' + key).then(r => r.json())
    }).then(data => {
      if (!data) return
      const saved = data.tasks || []
      setChecked(habits.map((_, i) => !!saved[i]))
    }).catch(() => {})
  }, [searchParams, habits])

  function toggle(i) {
    const next = checked.map((v, j) => j === i ? !v : v)
    setChecked(next)
    const allDone = next.every(Boolean)
    if (allDone) setPopup(true)
    if (dateKey) {
      fetch('/api/training/' + dateKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: allDone, tasks: next }),
      })
    }
  }

  function reset() {
    const blank = habits.map(() => false)
    setChecked(blank)
    setPopup(false)
    if (dateKey) {
      fetch('/api/training/' + dateKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: false, tasks: blank }),
      })
    }
  }

  const MONTH_RU = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']
  const dateLabel = dateKey ? (() => {
    const [, m, d] = dateKey.split('-').map(Number)
    return d + ' ' + MONTH_RU[m - 1]
  })() : '...'

  const backHref = dateKey ? `${HUB_URL}/day/${dateKey}` : HUB_URL

  return (
    <div className="rt-page">
      <nav className="rt-topbar">
        <a href={backHref} className="rt-topbar-logo">
          <img src="/logo.jpg" alt="K4RAGA" />
          K4RAGA
        </a>
        <span className="rt-topbar-title">РУТИНА</span>
      </nav>

      <div className="rt-main">
        <div className="rt-header">
          <h1 className="rt-title">Рутина</h1>
          <p className="rt-sub">{dateLabel}</p>
          <div className="rt-progress-wrap">
            <div className="rt-progress-bar" style={{ width: pct + '%' }} />
          </div>
          <div className="rt-progress-text">{done} / {total}</div>
        </div>

        <div className="rt-countdown">
          <div className="rt-countdown-label">До: {countdown.label} ({countdown.time})</div>
          <div className="rt-countdown-digits">
            <span>{String(countdown.h).padStart(2,'0')}</span>
            <span className="rt-countdown-sep">:</span>
            <span>{String(countdown.m).padStart(2,'0')}</span>
            <span className="rt-countdown-sep">:</span>
            <span>{String(countdown.s).padStart(2,'0')}</span>
          </div>
        </div>

        <div className="rt-task-list">
          {habits.map((h, i) => (
            <label key={h.id} className={'rt-task' + (checked[i] ? ' done' : '')} onClick={() => toggle(i)}>
              <div className="rt-task-number">
                {checked[i] ? null : <span>{h.num}</span>}
              </div>
              <div className="rt-task-info">
                <div className="rt-task-name">{h.name}</div>
                <div className="rt-task-hint">{h.hint}</div>
              </div>
              <div className="rt-task-icon">{ICONS[i]}</div>
            </label>
          ))}
        </div>

        <div className={'rt-complete' + (popup ? ' show' : '')}>
          <div className="rt-complete-icon">⭐</div>
          <h2>Рутина выполнена!</h2>
          <p>Отличный день — все привычки закрыты</p>
        </div>

        <div className="rt-actions">
          <div className="rt-nav-links">
            <Link href="/kkal" className="rt-nav-link">ККАЛ →</Link>
            <Link href="/sport" className="rt-nav-link">СПОРТ →</Link>
          </div>
          <button className="rt-reset-btn" onClick={reset}>СБРОСИТЬ</button>
        </div>
      </div>

      <div className="rt-footer">K4RAGA © 2026</div>
    </div>
  )
}

export default function RoutinePage() {
  return (
    <Suspense>
      <RoutineContent />
    </Suspense>
  )
}
