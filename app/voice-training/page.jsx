'use client'
import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Popup from '@/components/Popup/Popup'
import './page.css'

const EXERCISES = [
  { id:1, title:'Дыхание', subtitle:'Диафрагмальное дыхание', duration:120, icon:'breath', color:'#D40000',
    instructions:['Встаньте прямо, плечи расслаблены','Положите руку на живот','Вдох через нос на 4 счёта — живот вперёд','Задержка на 4 счёта','Медленный выдох через рот на 8 счётов','Повторяйте цикл всё время упражнения'],
    tip:'Плечи не поднимаются! Работает только диафрагма.' },
  { id:2, title:'Артикуляция', subtitle:'Разминка речевого аппарата', duration:120, icon:'mouth', color:'#ff3333',
    instructions:['Широко откройте рот, задержите 5 сек','Вытяните губы трубочкой → широкая улыбка (10 раз)','Язык: круговые движения по губам (5 раз в каждую сторону)','«Лошадка» — цокайте языком 15 раз','Надуйте щёки → втяните (10 раз)','Быстро произносите: Б-П Б-П, Д-Т Д-Т, Г-К Г-К'],
    tip:'Работайте перед зеркалом для контроля движений.' },
  { id:3, title:'Гласные', subtitle:'Чистота и объём звука', duration:90, icon:'waves', color:'#D40000',
    instructions:['Тяните каждую гласную на выдохе по 5 секунд:','А — О — У — Э — И — Ы','Теперь сочетания: АО-ОУ-УЭ-ЭИ-ИЫ','Произносите с нарастанием громкости:','а-А-а, о-О-о, у-У-у','Следите за округлостью и глубиной звука'],
    tip:'Челюсть свободна, звук идёт из груди, а не из горла.' },
  { id:4, title:'Скороговорки', subtitle:'Чёткость согласных', duration:180, icon:'bolt', color:'#ff4444',
    instructions:['Медленно, чётко, затем ускоряйтесь:','«Карл у Клары украл кораллы...»','«Шла Саша по шоссе и сосала сушку»','«На дворе трава, на траве дрова...»','«Тридцать три корабля лавировали...»','Каждую скороговорку — минимум 3 раза с ускорением'],
    tip:'Не глотайте окончания! Лучше медленно и чётко.' },
  { id:5, title:'Резонанс', subtitle:'Звучание и обертоны', duration:120, icon:'vibrate', color:'#8B0000',
    instructions:['Мычание «М-м-м» — почувствуйте вибрацию','«Н-н-н» — вибрация уходит выше, в лоб','Переходы: М-МА, М-МО, М-МУ, М-МЭ, М-МИ','Произносите нараспев: МАММ-МОММ-МУММ','ммм-МОЛОКО, ммм-МАЛИНА','«Мой милый мамонт мирно мычал»'],
    tip:'Пальцы к переносице — должна ощущаться вибрация.' },
  { id:6, title:'Интонация', subtitle:'Выразительность речи', duration:120, icon:'mask', color:'#D40000',
    instructions:['«Да» с 5 эмоциями: радость, удивление, грусть, злость, сомнение','«Какая сегодня погода» — вопрос, восклицание, мечтание, жалоба','Читайте вслух, меняя темп: быстро → медленно → средне','Числа от 1 до 10 с нарастающей энергией','«Я говорю уверенно и чётко» — диктор, друг, учитель','Любой абзац с паузами на знаках препинания'],
    tip:'Интонация — мелодия речи. Монотонность усыпляет.' },
  { id:7, title:'Финал', subtitle:'Закрепление и расслабление', duration:90, icon:'star', color:'#ff3333',
    instructions:['Глубокий вдох → длинное «Ааааа»','Зевните широко 3 раза','Промычите «Ммм» 10 секунд','Скороговорка из блока 4 в полную силу','«Мой голос звучит свободно, уверенно и красиво»','Потянитесь, встряхните руки — вы молодец!'],
    tip:'Запишите голос до и после — услышите разницу!' }
]

const TOTAL = EXERCISES.reduce((s, x) => s + x.duration, 0)
function fmt(s) { return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') }

function Icon({ type, size = 32, color = '#D40000' }) {
  const p = { width:size, height:size, viewBox:'0 0 32 32', fill:'none', stroke:color, strokeWidth:'2', strokeLinecap:'square' }
  const icons = {
    breath:  <svg {...p}><path d="M6 22 L10 14 L14 20 L18 10 L22 18 L26 12 L28 16"/><line x1="4" y1="26" x2="28" y2="26"/><path d="M14 6 L16 2 L18 6" strokeWidth="1.5"/></svg>,
    mouth:   <svg {...p}><rect x="5" y="8" width="22" height="16" rx="2"/><line x1="5" y1="16" x2="27" y2="16"/><line x1="11" y1="8" x2="11" y2="24" strokeWidth="1"/><line x1="16" y1="8" x2="16" y2="24" strokeWidth="1"/><line x1="21" y1="8" x2="21" y2="24" strokeWidth="1"/></svg>,
    waves:   <svg {...p}><path d="M4 16 Q8 6 12 16 Q16 26 20 16 Q24 6 28 16"/><path d="M4 22 Q8 16 12 22 Q16 28 20 22 Q24 16 28 22" strokeWidth="1.5" opacity=".5"/><path d="M4 10 Q8 4 12 10 Q16 16 20 10 Q24 4 28 10" strokeWidth="1.5" opacity=".5"/></svg>,
    bolt:    <svg {...p}><polygon points="18,2 8,18 15,18 12,30 24,14 17,14 20,2" fill={color} stroke="none"/></svg>,
    vibrate: <svg {...p}><circle cx="16" cy="16" r="4" fill={color} stroke="none"/><path d="M8 8 A12 12 0 0 0 8 24"/><path d="M24 8 A12 12 0 0 1 24 24"/><path d="M4 4 A18 18 0 0 0 4 28" strokeWidth="1.5"/><path d="M28 4 A18 18 0 0 1 28 28" strokeWidth="1.5"/></svg>,
    mask:    <svg {...p}><path d="M4 10 L16 4 L28 10 L28 20 L16 28 L4 20 Z"/><line x1="16" y1="4" x2="16" y2="28" strokeWidth="1"/><circle cx="11" cy="14" r="2" fill={color} stroke="none"/><circle cx="21" cy="14" r="2" fill={color} stroke="none"/></svg>,
    star:    <svg {...p}><polygon points="16,3 20,12 30,12 22,19 25,29 16,23 7,29 10,19 2,12 12,12"/></svg>
  }
  return icons[type] || null
}

function Timer({ progress, timeLeft, color, isRunning }) {
  const r = 90, c = 2 * Math.PI * r, o = c * (1 - progress)
  return (
    <div className="vt-timer">
      <svg width="220" height="220" viewBox="0 0 220 220">
        <circle cx="110" cy="110" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
        <circle cx="110" cy="110" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="square" strokeDasharray={c} strokeDashoffset={o}
          transform="rotate(-90 110 110)" style={{ transition:'stroke-dashoffset .4s,stroke .6s' }}/>
      </svg>
      <div className="vt-timer-inner">
        <span className="vt-timer-time">{fmt(timeLeft)}</span>
        <span className="vt-timer-status">{isRunning ? 'идёт' : 'пауза'}</span>
      </div>
    </div>
  )
}

function VoiceTrainingContent() {
  const searchParams = useSearchParams()
  const [idx, setIdx]       = useState(0)
  const [timeLeft, setTl]   = useState(EXERCISES[0].duration)
  const [running, setRun]   = useState(false)
  const [elapsed, setEl]    = useState(0)
  const [fin, setFin]       = useState(false)
  const [popup, setPopup]   = useState(false)
  const [dateKey, setKey]   = useState(null)
  const timerRef = useRef(null)
  const ex = EXERCISES[idx]

  useEffect(() => {
    const paramDate = searchParams.get('date')
    if (paramDate) {
      setKey(paramDate)
    } else {
      fetch('/api/date').then(r => r.json()).then(d => setKey(d.date)).catch(() => {
        const n = new Date()
        setKey(n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0'))
      })
    }
  }, [searchParams])

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }, [])

  useEffect(() => {
    if (fin) {
      if (dateKey) fetch('/api/training/'+dateKey, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({voice:true}) })
      setPopup(true)
    }
  }, [fin, dateKey])

  useEffect(() => {
    if (running && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTl(t => {
          if (t <= 1) {
            clearTimer()
            if (idx < EXERCISES.length - 1) {
              const n = idx + 1
              setEl(e => e + EXERCISES[idx].duration)
              setIdx(n); setRun(true)
              return EXERCISES[n].duration
            } else {
              setEl(TOTAL); setFin(true); setRun(false); return 0
            }
          }
          return t - 1
        })
      }, 1000)
    }
    return clearTimer
  }, [running, idx, clearTimer, timeLeft])

  function goTo(i) { clearTimer(); setIdx(i); setTl(EXERCISES[i].duration); setRun(false); setEl(EXERCISES.slice(0,i).reduce((s,x)=>s+x.duration,0)); setFin(false) }
  function skip() {
    if (idx < EXERCISES.length - 1) {
      const n = idx + 1; clearTimer()
      setEl(EXERCISES.slice(0,n).reduce((s,x)=>s+x.duration,0)); setIdx(n); setTl(EXERCISES[n].duration)
    } else { clearTimer(); setEl(TOTAL); setTl(0); setRun(false); setFin(true) }
  }
  function reset() { clearTimer(); setIdx(0); setTl(EXERCISES[0].duration); setRun(false); setEl(0); setFin(false); setPopup(false) }

  const totalProgress = (elapsed + (EXERCISES[idx].duration - timeLeft)) / TOTAL

  if (fin) return (
    <div className="vt-fin">
      <Icon type="star" size={64} color="#4ade80"/>
      <h1>ТРЕНИРОВКА ЗАВЕРШЕНА!</h1>
      <p>15 минут на голос — отличная инвестиция.</p>
      <button className="vt-restart-btn" onClick={reset}>ЗАНОВО</button>
      <div className="vt-fin-footer">K4RAGA © 2026</div>
      <Popup show={popup} icon="🎙️" title="ГОЛОС ПРОКАЧАН!" desc={<>Тренировка голоса завершена —<br/>возвращайся на главную</>} onClose={() => setPopup(false)}/>
    </div>
  )

  return (
    <div className="vt-page">
      <div className="vt-subheader">
        <div className="vt-sub-info">
          <span className="vt-sub-num">{idx+1} / {EXERCISES.length}</span>
          <span className="vt-sub-title">{ex.title}</span>
          <span className="vt-sub-sub">{ex.subtitle}</span>
        </div>
        <div className="vt-total-progress-wrap">
          <div className="vt-total-progress-bar" style={{ width:(totalProgress*100)+'%', backgroundColor:ex.color }}/>
        </div>
      </div>
      <div className="vt-main">
        <div className="vt-left">
          <Timer progress={timeLeft/ex.duration} timeLeft={timeLeft} color={ex.color} isRunning={running}/>
          <div className="vt-controls">
            <button className="vt-ctrl-btn vt-ctrl-border" onClick={skip}>⏭</button>
            <button className="vt-ctrl-btn vt-ctrl-primary" style={{background:ex.color}} onClick={() => setRun(r=>!r)}>
              {running ? '⏸' : '▶'}
            </button>
            <button className="vt-ctrl-btn vt-ctrl-border" onClick={reset}>↺</button>
          </div>
        </div>
        <div className="vt-right">
          <div className="vt-instructions">
            <div className="vt-inst-header"><Icon type={ex.icon} size={20} color={ex.color}/><span className="vt-inst-title">{ex.subtitle}</span></div>
            <ul className="vt-inst-list">{ex.instructions.map((l,i)=><li key={i}>{l}</li>)}</ul>
            <div className="vt-tip">💡 {ex.tip}</div>
          </div>
        </div>
      </div>
      <div className="vt-list-section">
        <div className="vt-list-label">ПРОГРАММА</div>
        <div className="vt-exercise-list">
          {EXERCISES.map((x,i) => {
            const done=i<idx, active=i===idx
            return (
              <button key={x.id} className={'vt-ex-item'+(active?' active':'')} onClick={()=>goTo(i)}>
                <div className={'vt-ex-icon'+(done?' done-icon':'')+(active?'':' dim')}>
                  {done ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="square"><polyline points="4,10 8,15 16,5"/></svg>
                        : <Icon type={x.icon} size={20} color={active?x.color:'#45454F'}/>}
                </div>
                <span className={'vt-ex-name'+(done?' done-name':'')+((!active&&!done)?' dim':'')}>{x.title}</span>
                <span className={'vt-ex-time'+((!active&&!done)?' dim':'')} style={active?{color:ex.color}:{}}>{fmt(active?timeLeft:x.duration)}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="vt-footer">K4RAGA © 2026</div>
      <Popup show={popup} icon="🎙️" title="ГОЛОС ПРОКАЧАН!" desc={<>Тренировка голоса завершена —<br/>возвращайся на главную</>} onClose={() => setPopup(false)}/>
    </div>
  )
}

export default function VoiceTraining() {
  return (
    <Suspense fallback={<div className="vt-page" />}>
      <VoiceTrainingContent />
    </Suspense>
  )
}
