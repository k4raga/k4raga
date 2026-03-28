'use client'
import { useState, useEffect } from 'react'
import './admin.css'

export default function AdminPage() {
  const [authed, setAuthed] = useState(null)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/admin/data')
      .then(r => {
        if (r.status === 401) { setAuthed(false); return null }
        setAuthed(true)
        return r.json()
      })
      .then(d => { if (d) setRows(d) })
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    const r = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    })
    if (r.ok) { setAuthed(true); loadData() }
    else setError('Неверный логин или пароль')
  }

  async function loadData() {
    setLoading(true)
    const r = await fetch('/api/admin/data')
    if (r.ok) setRows(await r.json())
    setLoading(false)
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    setAuthed(false)
    setRows([])
  }

  async function handleDelete(date) {
    if (!confirm('Удалить запись ' + date + '?')) return
    await fetch('/api/admin/data', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date })
    })
    loadData()
  }

  if (authed === null) return <div className="adm-loading">Загрузка...</div>

  if (!authed) return (
    <div className="adm-login-wrap">
      <form className="adm-login-box" onSubmit={handleLogin}>
        <div className="adm-login-title">CS ADMIN</div>
        {error && <div className="adm-error">{error}</div>}
        <input className="adm-input" placeholder="Логин" value={login} onChange={e => setLogin(e.target.value)} autoFocus/>
        <input className="adm-input" placeholder="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
        <button className="adm-btn" type="submit">ВОЙТИ</button>
      </form>
    </div>
  )

  return (
    <div className="adm-page">
      <div className="adm-header">
        <span className="adm-title">CS ADMIN</span>
        <div className="adm-header-right">
          <button className="adm-btn-sm" onClick={loadData}>Обновить</button>
          <button className="adm-btn-sm adm-btn-out" onClick={handleLogout}>Выйти</button>
        </div>
      </div>

      <div className="adm-section-title">CS Тренировки ({rows.length} записей)</div>

      {loading ? <div className="adm-loading">Загрузка...</div> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Статус</th>
                <th>Задачи</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={4} className="adm-empty">Нет данных</td></tr>
              )}
              {rows.map(row => {
                const tasks = (() => { try { return JSON.parse(row.cs_tasks || '[]') } catch { return [] } })()
                const doneCnt = tasks.filter(Boolean).length
                return (
                  <tr key={row.date}>
                    <td className="adm-date">{row.date}</td>
                    <td><span className={row.done ? 'adm-yes' : 'adm-no'}>{row.done ? '✓ GG WP' : '—'}</span></td>
                    <td className="adm-tasks">{doneCnt}/{tasks.length}</td>
                    <td><button className="adm-del-btn" onClick={() => handleDelete(row.date)}>✕</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
