'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import './Calendar.css'

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']

function toKey(y, m, d) {
  return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0')
}

export default function Calendar() {
  const router = useRouter()
  const [today, setToday] = useState(new Date())
  const [viewYear, setViewYear] = useState(new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(new Date().getMonth())
  const [allData, setAllData] = useState({})

  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate())

  useEffect(() => {
    fetch('/api/date')
      .then(r => r.json())
      .then(d => {
        const dt = new Date(d.year, d.month - 1, d.day)
        setToday(dt)
        setViewYear(dt.getFullYear())
        setViewMonth(dt.getMonth())
      })
      .catch(() => {})
    fetch('/api/training').then(r => r.json()).then(setAllData).catch(() => {})
  }, [])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const offset = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const cells = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="calendar">
      <div className="cal-header">
        <div className="cal-title">{MONTHS[viewMonth]} {viewYear}</div>
        <div className="cal-nav">
          <button className="cal-btn" onClick={prevMonth}>←</button>
          <button className="cal-btn" onClick={nextMonth}>→</button>
        </div>
      </div>
      <div className="cal-weekdays">
        {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d => (
          <div key={d} className="cal-weekday">{d}</div>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((d, i) => {
          if (!d) return <div key={'e' + i} className="cal-day empty" />
          const key = toKey(viewYear, viewMonth, d)
          const isToday = key === todayKey
          const dayData = allData[key] || {}
          const allDone = dayData.cs && dayData.voice
          const isFuture = new Date(viewYear, viewMonth, d) > todayDate
          let cls = 'cal-day'
          if (!isFuture) cls += ' cur-month'
          if (isToday) cls += ' today'
          if (allDone) cls += ' done'
          return (
            <div
              key={key}
              className={cls}
              style={isFuture ? { opacity: 0.3 } : {}}
              onClick={!isFuture ? () => router.push('/day/' + key) : undefined}
            >
              <div className="cal-day-num">{d}</div>
              <div className={'cal-tag' + (dayData.cs ? ' tag-done' : '')}>
                <span className="cal-tag-check">{dayData.cs ? '✓' : ''}</span>CS
              </div>
              <div className={'cal-tag' + (dayData.voice ? ' tag-done' : '')}>
                <span className="cal-tag-check">{dayData.voice ? '✓' : ''}</span>Голос
              </div>
            </div>
          )
        })}
      </div>
      <div className="cal-legend">
        <div className="cal-legend-item"><div className="cal-dot dot-today" />Сегодня</div>
        <div className="cal-legend-item"><div className="cal-dot dot-done" />Оба пройдены</div>
      </div>
    </div>
  )
}
