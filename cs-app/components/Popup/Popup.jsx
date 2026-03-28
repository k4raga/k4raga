'use client'
import './Popup.css'

export default function Popup({ show, icon, title, desc, onClose, backHref }) {
  return (
    <div className={'popup-overlay' + (show ? ' show' : '')}>
      <div className="popup">
        <button className="popup-close" onClick={onClose}>✕</button>
        <div className="popup-icon">{icon}</div>
        <div className="popup-title">{title}</div>
        <p className="popup-desc">{desc}</p>
        <a className="popup-btn" href={backHref || '/'}>
          {backHref && backHref !== '/' ? 'К дню' : 'На главную'}
        </a>
      </div>
    </div>
  )
}
