'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import './page.css'

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || 'https://k4raga.ru'

const MONTH   = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']
const WEEKDAY = ['вс','пн','вт','ср','чт','пт','сб']

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const w = new Date(y, m - 1, d).getDay()
  return { day: d, month: MONTH[m - 1], weekday: WEEKDAY[w] }
}

export default function Home() {
  const [today,     setToday]     = useState(null)
  const [history,   setHistory]   = useState({})
  const [exercises, setExercises] = useState([])

  useEffect(() => {
    fetch('/api/date').then(r => r.json()).then(d => setToday(d.date))
    fetch('/api/training').then(r => r.json()).then(setHistory)
    fetch('/api/exercises').then(r => r.json()).then(setExercises).catch(() => {})
  }, [])

  const todayDone = today && history[today]?.done
  const days = Object.entries(history).sort(([a], [b]) => b.localeCompare(a))

  function deleteDay(dateStr, e) {
    e.preventDefault()
    e.stopPropagation()
    fetch('/api/training/' + dateStr, { method: 'DELETE' })
    setHistory(h => { const n = { ...h }; delete n[dateStr]; return n })
  }

  return (
    <div className="home">
      <nav className="home-topbar">
        <a href={HUB_URL} className="home-topbar-logo">
          <img src="/logo.jpg" alt="K4RAGA" />
          K4RAGA
        </a>
        <span className="home-topbar-title">CS ТРЕНИРОВКА</span>
      </nav>

      <div className="home-hero">
        <div className="home-hero-tag">COUNTER-STRIKE</div>
        <h1 className="home-hero-title">CS Тренировка</h1>
        <p className="home-hero-sub">Аим · Мувмент · Пистолеты · Автоматы · Снайпинг</p>
        <Link
          href={today ? `/training?date=${today}` : '/training'}
          className={'home-start-btn' + (todayDone ? ' done' : '')}
        >
          {todayDone ? '✓ СЕГОДНЯ ВЫПОЛНЕНО' : 'НАЧАТЬ ТРЕНИРОВКУ →'}
        </Link>
      </div>

      <div className="home-columns">
        <div className="home-col">
          <div className="home-col-label">ИСТОРИЯ ТРЕНИРОВОК</div>
          {days.length > 0 ? (
            <div className="home-cards">
              {days.map(([dateStr, data]) => {
                const { day, month, weekday } = formatDate(dateStr)
                const tasks   = data.cs_tasks || []
                const doneCnt = tasks.filter(Boolean).length
                const isToday = dateStr === today

                return (
                  <Link key={dateStr} href={`/training?date=${dateStr}`} className={'home-card' + (data.done ? ' card-done' : '')}>
                    <button className="home-card-delete" onClick={(e) => deleteDay(dateStr, e)}>✕</button>
                    <div className="home-card-head">
                      <div className="home-card-date">
                        <span className="home-card-day">{day}</span>
                        <span className="home-card-month">{month}</span>
                        {isToday && <span className="home-card-today">сегодня</span>}
                      </div>
                      <div className="home-card-weekday">{weekday}</div>
                      <div className={'home-card-badge' + (data.done ? ' badge-done' : ' badge-fail')}>
                        {data.done ? 'GG WP' : `${doneCnt}/${exercises.length || tasks.length}`}
                      </div>
                    </div>
                    <div className="home-card-tasks">
                      {exercises.map((ex, i) => (
                        <div key={ex.id} className={'home-card-task' + (tasks[i] ? ' task-done' : '')}>
                          <span className="home-card-task-icon">{tasks[i] ? '✓' : '○'}</span>
                          <span className="home-card-task-name">{ex.name}</span>
                        </div>
                      ))}
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : today ? (
            <div className="home-empty">
              <p>Тренировок ещё нет — начни первую!</p>
            </div>
          ) : null}
        </div>

        <div className="home-col">
          <div className="home-col-label">ПРОГРАММА ТРЕНИРОВКИ</div>
          <div className="home-ex-list">
            {exercises.map((ex) => (
              <div key={ex.id} className="home-ex-item">
                <div className="home-ex-num">{ex.num}</div>
                <div className="home-ex-info">
                  <div className="home-ex-name">{ex.name}</div>
                  <div className="home-ex-tags">
                    {ex.hint.split(',').map((t, i) => (
                      <span key={i} className="home-ex-tag">{t.trim()}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="home-footer">K4RAGA © 2026</div>
    </div>
  )
}
