import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ANIMALS } from '../data/cards';

export default function Navbar() {
  const { collection, coins } = useGame();
  const total = ANIMALS.length;
  const owned = collection.length;
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/shop', label: 'Shop' },
    { to: '/zoo', label: 'My Zoo' },
    { to: '/collection', label: 'Collection' },
    { to: '/play', label: 'Play' },
    { to: '/breed', label: 'Breed' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="nav-logo">✦ Collectibles</span>
        <div className="nav-links">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end={l.end} onClick={() => setMenuOpen(false)}>{l.label}</NavLink>
          ))}
        </div>
        <div className="nav-stats">
          <span>📦 {owned}/{total}</span>
          <span>🪙 {coins}</span>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
        </button>
      </div>
      {menuOpen && (
        <div className="mobile-menu">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`} end={l.end} onClick={() => setMenuOpen(false)}>{l.label}</NavLink>
          ))}
          <div className="mobile-nav-stats">
            <span>📦 {owned}/{total}</span>
            <span>🪙 {coins}</span>
          </div>
        </div>
      )}
    </nav>
  );
}
