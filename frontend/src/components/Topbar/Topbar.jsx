import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo.js'
import './Topbar.css'

export default function Topbar() {
  return (
    <nav className="topbar">
      <NavLink to="/" className="topbar-left">
        <img className="topbar-logo" src={logo} alt="K4RAGA" />
        <span className="topbar-name">K4RAGA</span>
      </NavLink>
      <div className="topbar-nav">
        <NavLink to="/" end className={({ isActive }) => 'topbar-link' + (isActive ? ' active' : '')}>Hub</NavLink>
        <NavLink to="/cs-training" className={({ isActive }) => 'topbar-link' + (isActive ? ' active' : '')}>CS</NavLink>
        <NavLink to="/voice-training" className={({ isActive }) => 'topbar-link' + (isActive ? ' active' : '')}>Голос</NavLink>
      </div>
    </nav>
  )
}
