import { useNavigate } from 'react-router-dom'
import './Popup.css'

export default function Popup({ show, icon, title, desc, onClose }) {
  const navigate = useNavigate()

  return (
    <div className={'popup-overlay' + (show ? ' show' : '')}>
      <div className="popup">
        <button className="popup-close" onClick={onClose}>✕</button>
        <div className="popup-icon">{icon}</div>
        <div className="popup-title">{title}</div>
        <p className="popup-desc">{desc}</p>
        <button className="popup-btn" onClick={() => navigate('/')}>На главную</button>
      </div>
    </div>
  )
}
