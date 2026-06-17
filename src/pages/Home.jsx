import { useGame } from '../context/GameContext';
import { ANIMALS } from '../data/cards';

export default function Home() {
  const { collection, canClaim, coins, zoo, aliveAnimals, deadAnimals } = useGame();
  const total = ANIMALS.length;
  const owned = collection.length;
  const pct = Math.round((owned / total) * 100);
  const totalEnvs = zoo.environments.length;

  const rarityCounts = {};
  ANIMALS.forEach(a => {
    rarityCounts[a.rarity] = (rarityCounts[a.rarity] || 0) + 1;
  });
  const ownedRarity = {};
  collection.forEach(id => {
    const a = ANIMALS.find(c => c.id === id);
    if (a) ownedRarity[a.rarity] = (ownedRarity[a.rarity] || 0) + 1;
  });

  return (
    <div className="page">
      <div className="home-hero">
        <h1>Collect 'em All!</h1>
        <p>Open packs, build your zoo, discover amazing animals, and keep them alive!</p>
      </div>

      <div className="home-grid">
        <div className="home-card">
          <div className="home-card-icon">📊</div>
          <h3>Collection Progress</h3>
          <p>Animals discovered in your collection book.</p>
          <div className="stat">{owned}/{total}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="home-card">
          <div className="home-card-icon">🎒</div>
          <h3>Daily Pack</h3>
          <p>{canClaim ? 'A free pack is waiting in the Shop!' : 'Daily pack claimed! Come back tomorrow.'}</p>
          <div className="stat">{canClaim ? '🎁 Available' : '⏰ Claimed'}</div>
        </div>

        <div className="home-card">
          <div className="home-card-icon">🌿</div>
          <h3>My Zoo</h3>
          <p>Your living collection. Keep them fed!</p>
          <div className="stat" style={{ fontSize: 20 }}>
            🏠 {totalEnvs} env · 🐾 {aliveAnimals} alive{deadAnimals > 0 ? ` · 💀 ${deadAnimals} dead` : ''}
          </div>
        </div>

        <div className="home-card">
          <div className="home-card-icon">🪙</div>
          <h3>Coins</h3>
          <p>Buy premium packs for rare finds.</p>
          <div className="stat" style={{ color: 'var(--orange)' }}>{coins}</div>
        </div>

        <div className="home-card">
          <div className="home-card-icon">🏆</div>
          <h3>Rarity Breakdown</h3>
          <p>Your collection by rarity tier.</p>
          {['common', 'uncommon', 'rare', 'epic', 'legendary'].map(r => (
            <div key={r} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0', color: 'var(--text-muted)' }}>
              <span style={{ textTransform: 'capitalize' }}>{r}</span>
              <span style={{ fontWeight: 600 }}>{(ownedRarity[r] || 0)}/{(rarityCounts[r] || 0)}</span>
            </div>
          ))}
        </div>

        <div className="home-card">
          <div className="home-card-icon">🌿</div>
          <h3>Animals Book</h3>
          <p>Your first collection book featuring {total} amazing animals.</p>
          <div className="stat">{pct}%</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
