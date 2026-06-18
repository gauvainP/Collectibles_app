import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Collection from './pages/Collection';
import MyZoo from './pages/MyZoo';
import Play from './pages/Play';
import Breed from './pages/Breed';
import './App.css';

function CheatPage() {
  const { ageJackReward } = useGame();
  const navigate = useNavigate();
  useEffect(() => {
    ageJackReward(10000);
    navigate('/');
  }, [ageJackReward, navigate]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/zoo" element={<MyZoo />} />
            <Route path="/play" element={<Play />} />
            <Route path="/breed" element={<Breed />} />
            <Route path="/neginmylife" element={<CheatPage />} />
          </Routes>
        </div>
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
