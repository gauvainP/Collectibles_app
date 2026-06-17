import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Collection from './pages/Collection';
import MyZoo from './pages/MyZoo';
import './App.css';

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
          </Routes>
        </div>
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
