import { useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { getAnimalById } from '../data/cards';

export default function Breed() {
  const { zoo, inventory, breedPair, ageJackReward } = useGame();

  const pairs = useMemo(() => {
    const result = [];
    const males = {};
    const females = {};

    zoo.environments.forEach(env => {
      if (!env.animal?.alive) return;
      const { cardId, sex } = env.animal;
      if (sex === 'male') {
        if (!males[cardId]) males[cardId] = [];
        males[cardId].push(env);
      } else if (sex === 'female') {
        if (!females[cardId]) females[cardId] = [];
        females[cardId].push(env);
      }
    });

    Object.keys(males).forEach(cardId => {
      if (females[cardId]) {
        males[cardId].forEach(m => {
          females[cardId].forEach(f => {
            result.push({ male: m, female: f, cardId });
          });
        });
      }
    });

    return result;
  }, [zoo.environments]);

  const eggs = inventory.filter(i => i.type === 'egg');

  return (
    <div className="page">
      <h1 className="page-title">Breeding Center<button onClick={() => ageJackReward(1000)} style={{ opacity: 0, width: 40, cursor: 'pointer' }} aria-label="Debug: add 1000 coins" /></h1>
      <p className="page-subtitle">
        Breed a male and female of the same species to get an egg card worth 100 coins. Wait a day to hatch it into a baby instead!
      </p>

      {pairs.length === 0 && eggs.length === 0 && (
        <div className="zoo-empty-state">
          <div style={{ fontSize: 64, marginBottom: 16 }}>🧬</div>
          <h2>No Breeding Pairs Available</h2>
          <p>
            You need at least one male and one female of the same species
            placed in your zoo to breed them.
          </p>
        </div>
      )}

      {eggs.length > 0 && (
        <div className="breed-section">
          <h2 className="breed-section-title">🥚 Eggs in Inventory</h2>
          <div className="breed-eggs-grid">
            {eggs.map(egg => {
              const def = getAnimalById(egg.cardId);
              return (
                <div key={egg.uid} className="egg-card">
                  <div className="egg-emoji">🥚</div>
                  <div className="egg-info">
                    <span className="egg-species">{def?.emoji} {def?.name || egg.cardId}</span>
                    <span className="egg-timer">Hatches on next daily reset</span>
                  </div>
                  <div className="egg-value">Sell for 100 🪙</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {pairs.length > 0 && (
        <div className="breed-section">
          <h2 className="breed-section-title">🧬 Available Pairs</h2>
          <div className="breed-pairs-grid">
            {pairs.map((pair, i) => {
              const maleAge = pair.male.animal.age ?? 0;
              const maleLifespan = pair.male.animal.lifespan || 10;
              const femaleAge = pair.female.animal.age ?? 0;
              const femaleLifespan = pair.female.animal.lifespan || 10;
              const def = getAnimalById(pair.cardId);
              return (
                <div key={i} className="breed-pair-card">
                  <div className="pair-species-header">
                    {def?.emoji} {def?.name}
                  </div>
                  <div className="pair-animals">
                    <div className="pair-animal male">
                      <span className="pair-sex">♂</span>
                      <span className="pair-name">{def?.name}</span>
                      <span className="pair-age">Age: {maleAge}y</span>
                      <div className="life-bar">
                        <div className="life-fill" style={{ width: `${(maleAge / maleLifespan) * 100}%` }} />
                      </div>
                    </div>
                    <div className="pair-heart">+</div>
                    <div className="pair-animal female">
                      <span className="pair-sex">♀</span>
                      <span className="pair-name">{def?.name}</span>
                      <span className="pair-age">Age: {femaleAge}y</span>
                      <div className="life-bar">
                        <div className="life-fill" style={{ width: `${(femaleAge / femaleLifespan) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="pair-warning">
                    ⚠️ Both parents die. Egg card goes to inventory.
                  </div>
                  <button
                    className="claim-btn breed-btn"
                    onClick={() => breedPair(pair.male.id, pair.female.id)}
                  >
                    🧬 Breed & Get Egg Card
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
