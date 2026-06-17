import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import PackOpener from '../components/PackOpener';

export default function Shop() {
  const { canClaim, hasPack, coins, packCost, gigaPackCost, foodPackCost, toyPackCost, animalPackCost, claimPack, buyPack, buyGigaPack, buyFoodPack, buyToyPack, buyAnimalPack } = useGame();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (canClaim) { setTimeLeft(''); return; }
    const tick = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow - now;
      if (diff <= 0) { setTimeLeft(''); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [canClaim]);

  return (
    <div className="page">
      <PackOpener />
      <div className="shop-header">
        <div>
          <h1 className="page-title">Shop</h1>
          <p className="page-subtitle">Open packs to discover animals, food, toys, and more!</p>
        </div>
        <div className="coin-display">
          <span>🪙</span>
          <span className="coin-amount">{coins}</span>
        </div>
      </div>

      <div className="shop-packs">
        <div className="shop-pack-card">
          <div className={`pack-icon${!canClaim && !hasPack ? ' claimed' : ''}`}>🎁</div>
          <h3>Daily Free Pack</h3>
          <p>5 random items — free every day!</p>
          {canClaim && !hasPack && (
            <button className="claim-btn" onClick={claimPack}>Claim Free</button>
          )}
          {!canClaim && hasPack && (
            <button className="claim-btn open-pack" disabled>Pack Ready! Click to reveal</button>
          )}
          {!canClaim && !hasPack && timeLeft && (
            <div className="claim-timer">Next pack in {timeLeft}</div>
          )}
        </div>

        <div className="shop-pack-card">
          <div className="pack-icon">✨</div>
          <h3>Premium Pack</h3>
          <p>5 random items — {packCost} coins</p>
          <button
            className={`claim-btn${coins >= packCost && !hasPack ? '' : ' disabled'}`}
            onClick={() => coins >= packCost && !hasPack && buyPack()}
            disabled={coins < packCost || hasPack}
          >
            {hasPack ? 'Open Current Pack First' : coins >= packCost ? `Buy — ${packCost}🪙` : 'Not Enough Coins'}
          </button>
        </div>

        <div className="shop-pack-card">
          <div className="pack-icon">💎</div>
          <h3>Giga Pack</h3>
          <p>30 random items — bulk discount! {gigaPackCost} coins</p>
          <button
            className={`claim-btn${coins >= gigaPackCost && !hasPack ? '' : ' disabled'}`}
            onClick={() => coins >= gigaPackCost && !hasPack && buyGigaPack()}
            disabled={coins < gigaPackCost || hasPack}
          >
            {hasPack ? 'Open Current Pack First' : coins >= gigaPackCost ? `Buy — ${gigaPackCost}🪙` : 'Not Enough Coins'}
          </button>
        </div>

        <div className="shop-pack-card">
          <div className="pack-icon">🍎</div>
          <h3>Food Pack</h3>
          <p>5 food & drinks — 20% chance of a clown! {foodPackCost} coins</p>
          <button
            className={`claim-btn${coins >= foodPackCost && !hasPack ? '' : ' disabled'}`}
            onClick={() => coins >= foodPackCost && !hasPack && buyFoodPack()}
            disabled={coins < foodPackCost || hasPack}
          >
            {hasPack ? 'Open Current Pack First' : coins >= foodPackCost ? `Buy — ${foodPackCost}🪙` : 'Not Enough Coins'}
          </button>
        </div>

        <div className="shop-pack-card">
          <div className="pack-icon">🎾</div>
          <h3>Toy Pack</h3>
          <p>2 random toys — {toyPackCost} coins</p>
          <button
            className={`claim-btn${coins >= toyPackCost && !hasPack ? '' : ' disabled'}`}
            onClick={() => coins >= toyPackCost && !hasPack && buyToyPack()}
            disabled={coins < toyPackCost || hasPack}
          >
            {hasPack ? 'Open Current Pack First' : coins >= toyPackCost ? `Buy — ${toyPackCost}🪙` : 'Not Enough Coins'}
          </button>
        </div>

        <div className="shop-pack-card">
          <div className="pack-icon">🐾</div>
          <h3>Animal Pack</h3>
          <p>1 random animal — {animalPackCost} coins</p>
          <button
            className={`claim-btn${coins >= animalPackCost && !hasPack ? '' : ' disabled'}`}
            onClick={() => coins >= animalPackCost && !hasPack && buyAnimalPack()}
            disabled={coins < animalPackCost || hasPack}
          >
            {hasPack ? 'Open Current Pack First' : coins >= animalPackCost ? `Buy — ${animalPackCost}🪙` : 'Not Enough Coins'}
          </button>
        </div>
      </div>
    </div>
  );
}
