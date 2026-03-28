'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import './page.css'

const MONTH_NAMES = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return d + ' ' + MONTH_NAMES[m - 1] + ' ' + y
}

export default function DayPage() {
  const { date } = useParams()
  const [data, setData] = useState(null)
  const [todayKey, setTodayKey] = useState(null)

  useEffect(() => {
    fetch('/api/date').then(r => r.json()).then(d => {
      setTodayKey(d.date)
    }).catch(() => {})

    fetch('/api/training/' + date)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({}))
  }, [date])

  const isToday = todayKey === date
  const csDone = data?.cs
  const voiceDone = data?.voice
  const allDone = csDone && voiceDone

  const [y, m, d] = date.split('-').map(Number)
  const weekday = new Date(y, m - 1, d).toLocaleDateString('ru-RU', { weekday: 'long' })

  return (
    <div className="day-page">
      <div className="day-back-wrap">
        <Link href="/" className="day-back">← Назад</Link>
      </div>

      <div className="day-header">
        <div className="day-weekday">{weekday}</div>
        <div className="day-date">{formatDate(date)}</div>
        {allDone && <div className="day-badge-done">ВСЁ ВЫПОЛНЕНО</div>}
      </div>

      <div className="day-blocks">
        <div className={'day-block' + (csDone ? ' block-done' : '')}>
          <div className="day-block-top">
            <div className="day-block-icon">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <rect x="3" y="10" width="20" height="12" rx="1"/>
                <path d="M23 14h4l2 2-2 2h-4"/>
                <line x1="9" y1="16" x2="13" y2="16"/>
              </svg>
            </div>
            <div className="day-block-info">
              <div className="day-block-title">CS Тренировка</div>
              <div className="day-block-sub">Прицел, стрейф, дигл, снайпер</div>
            </div>
            <div className={'day-block-status' + (csDone ? ' status-done' : ' status-empty')}>
              {csDone
                ? <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="square"><polyline points="4,12 9,17 20,6"/></svg>
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              }
            </div>
          </div>
          {csDone
            ? <div className="day-block-done-label">Выполнено</div>
            : <Link href="/cs-training" className="day-block-btn">{isToday ? 'НАЧАТЬ ТРЕНИРОВКУ →' : 'ОТКРЫТЬ →'}</Link>
          }
        </div>

        <div className={'day-block' + (voiceDone ? ' block-done' : '')}>
          <div className="day-block-top">
            <div className="day-block-icon">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <rect x="12" y="3" width="8" height="16" rx="1"/>
                <path d="M8 15v4a8 8 0 0016 0v-4"/>
                <line x1="16" y1="27" x2="16" y2="31"/>
                <line x1="11" y1="31" x2="21" y2="31"/>
              </svg>
            </div>
            <div className="day-block-info">
              <div className="day-block-title">Голос</div>
              <div className="day-block-sub">Дыхание, артикуляция, резонанс</div>
            </div>
            <div className={'day-block-status' + (voiceDone ? ' status-done' : ' status-empty')}>
              {voiceDone
                ? <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="square"><polyline points="4,12 9,17 20,6"/></svg>
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              }
            </div>
          </div>
          {voiceDone
            ? <div className="day-block-done-label">Выполнено</div>
            : <Link href="/voice-training" className="day-block-btn">{isToday ? 'НАЧАТЬ ТРЕНИРОВКУ →' : 'ОТКРЫТЬ →'}</Link>
          }
        </div>
      </div>
    </div>
  )
}
