import { NavLink } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ANIMALS } from '../data/cards';

export default function Navbar() {
  const { collection, coins } = useGame();
  const total = ANIMALS.length;
  const owned = collection.length;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="nav-logo">✦ Collectibles</span>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>Home</NavLink>
          <NavLink to="/shop" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Shop</NavLink>
          <NavLink to="/zoo" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>My Zoo</NavLink>
          <NavLink to="/collection" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Collection</NavLink>
          <NavLink to="/play" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Play</NavLink>
          <NavLink to="/breed" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Breed</NavLink>
        </div>
        <div className="nav-stats">
          <span>📦 {owned}/{total}</span>
          <span>🪙 {coins}</span>
        </div>
      </div>
    </nav>
  );
}
