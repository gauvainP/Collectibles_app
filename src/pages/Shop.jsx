import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { ANIMALS, ENVIRONMENTS, FOOD_TYPES, ENV_DECORATIONS, TOY_NAMES, ITEM_WEIGHTS, RARITIES } from '../data/cards';
import PackOpener from '../components/PackOpener';

const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const TOTAL_RARITY_W = RARITY_ORDER.reduce((s, r) => s + RARITIES[r].weight, 0);

function animalsByRarity() {
  return RARITY_ORDER.map(r => ({
    rarity: r,
    color: RARITIES[r].color,
    label: RARITIES[r].name,
    list: ANIMALS.filter(a => a.rarity === r),
  }));
}

function animalPct(mainPct) {
  return RARITY_ORDER.map(r => ({
    rarity: r,
    color: RARITIES[r].color,
    label: RARITIES[r].name,
    pct: mainPct * (RARITIES[r].weight / TOTAL_RARITY_W),
    animals: ANIMALS.filter(a => a.rarity === r),
  }));
}

function PayoutModal({ onClose }) {
  const totalW = Object.values(ITEM_WEIGHTS).reduce((a, b) => a + b, 0);
  const pct = (w) => ((w / totalW) * 100);
  const animalOverall = pct(ITEM_WEIGHTS.animal);
  const toyOverall = pct(ITEM_WEIGHTS.toy);

  const mainTypes = [
    {
      type: 'Animal', weight: ITEM_WEIGHTS.animal, sub: animalPct(animalOverall).map(r => ({
        label: r.label, color: r.color, pct: r.pct, animals: r.animals,
      })),
    },
    { type: 'Environment', weight: ITEM_WEIGHTS.environment, sub: ENVIRONMENTS.map(e => ({ label: `${e.emoji} ${e.name}`, pct: pct(ITEM_WEIGHTS.environment) / ENVIRONMENTS.length })) },
    { type: 'Food', weight: ITEM_WEIGHTS.food, sub: FOOD_TYPES.map(f => ({ label: `${f.emoji} ${f.name}`, pct: pct(ITEM_WEIGHTS.food) / FOOD_TYPES.length })) },
    { type: 'Coins (20🪙)', weight: ITEM_WEIGHTS.coins },
    {
      type: 'Toy', weight: ITEM_WEIGHTS.toy, sub: animalPct(toyOverall).map(r => ({
        label: r.label, color: r.color, pct: r.pct, animals: r.animals,
      })),
    },
    {
      type: 'Decoration', weight: ITEM_WEIGHTS.decoration, sub: (() => {
        const decPct = pct(ITEM_WEIGHTS.decoration);
        const allDecs = Object.values(ENV_DECORATIONS).flat();
        const totalRarityW = RARITY_ORDER.reduce((s, r) => s + RARITIES[r].weight, 0);
        return RARITY_ORDER.map(r => ({
          label: RARITIES[r].name, color: RARITIES[r].color, pct: decPct * (RARITIES[r].weight / totalRarityW),
          items: allDecs.filter(d => d.rarity === r),
        }));
      })(),
    },
    { type: 'Empty', weight: ITEM_WEIGHTS.empty },
  ];

  const foodPct = (w) => ((w / 100) * 100);
  const foodSubPct = foodPct(80) / FOOD_TYPES.length;

  const byRarity = animalsByRarity();

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: 560, maxHeight: '85vh' }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>📊 Drop Rates</h2>

        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600 }}>MAIN PACK (Daily / Premium / Giga)</div>
        <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
          {mainTypes.map(t => (
            <div key={t.type}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span>{t.type}</span>
                <span style={{ fontWeight: 600 }}>{pct(t.weight).toFixed(1)}%</span>
              </div>
              {t.sub && !t.sub[0]?.animals && !t.sub[0]?.items && (
                <div style={{ paddingLeft: 16, fontSize: 11, color: 'var(--text-muted)' }}>
                  {t.sub.map(s => (
                    <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0' }}>
                      <span>{s.label}</span>
                      <span>{s.pct.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              )}
              {t.sub && t.sub[0]?.animals && (
                <div style={{ paddingLeft: 16, fontSize: 11, color: 'var(--text-muted)' }}>
                  {t.sub.map(r => (
                    <div key={r.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontWeight: 600, color: r.color }}>
                        <span>{r.label}</span>
                        <span>{r.pct.toFixed(2)}%</span>
                      </div>
                      <div style={{ paddingLeft: 12 }}>
                        {r.animals.map(a => (
                          <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0' }}>
                            <span>{a.emoji} {a.name}</span>
                            <span>{(r.pct / r.animals.length).toFixed(3)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {t.sub && t.sub[0]?.items && (
                <div style={{ paddingLeft: 16, fontSize: 11, color: 'var(--text-muted)' }}>
                  {t.sub.map(r => (
                    <div key={r.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontWeight: 600, color: r.color }}>
                        <span>{r.label}</span>
                        <span>{r.pct.toFixed(2)}%</span>
                      </div>
                      <div style={{ paddingLeft: 12 }}>
                        {r.items.map(d => (
                          <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0' }}>
                            <span>{d.emoji} {d.name}</span>
                            <span>{(r.pct / r.items.length).toFixed(3)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600 }}>FOOD PACK</div>
        <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span>Food</span>
              <span style={{ fontWeight: 600 }}>80%</span>
            </div>
            <div style={{ paddingLeft: 16, fontSize: 11, color: 'var(--text-muted)' }}>
              {FOOD_TYPES.map(f => (
                <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0' }}>
                  <span>{f.emoji} {f.name}</span>
                  <span>{foodSubPct.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
            <span>Clown (Empty)</span>
            <span style={{ fontWeight: 600 }}>20%</span>
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600 }}>TOY PACK</div>
        <div style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 20, color: 'var(--text-muted)' }}>
          {byRarity.map(r => (
            <div key={r.rarity}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontWeight: 600, color: r.color, fontSize: 12 }}>
                <span>{r.label}</span>
                <span>{(toyOverall * (RARITIES[r.rarity].weight / TOTAL_RARITY_W)).toFixed(1)}%</span>
              </div>
              <div style={{ paddingLeft: 12 }}>
                {r.list.map(a => {
                  const toy = TOY_NAMES[a.id];
                  const perToy = (toyOverall * (RARITIES[r.rarity].weight / TOTAL_RARITY_W)) / r.list.length;
                  return (
                    <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0' }}>
                      <span>{toy?.emoji || '🎾'} {toy?.name || 'Toy'} ({a.emoji} {a.name})</span>
                      <span>{perToy.toFixed(2)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600 }}>ANIMAL PACK</div>
        <div style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 20, color: 'var(--text-muted)' }}>
          {byRarity.map(r => (
            <div key={r.rarity}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontWeight: 600, color: r.color, fontSize: 12 }}>
                <span>{r.label}</span>
                <span>{(100 * (RARITIES[r.rarity].weight / TOTAL_RARITY_W)).toFixed(1)}%</span>
              </div>
              <div style={{ paddingLeft: 12 }}>
                {r.list.map(a => {
                  const perAnimal = (100 * (RARITIES[r.rarity].weight / TOTAL_RARITY_W)) / r.list.length;
                  return (
                    <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0' }}>
                      <span>{a.emoji} {a.name}</span>
                      <span>{perAnimal.toFixed(2)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600 }}>ENVIRONMENT PACK</div>
        <div style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 20, color: 'var(--text-muted)' }}>
          {ENVIRONMENTS.map(e => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0' }}>
              <span>{e.emoji} {e.name}</span>
              <span>{(100 / ENVIRONMENTS.length).toFixed(1)}%</span>
            </div>
          ))}
        </div>

        <button className="action-btn" onClick={onClose} style={{ width: '100%', textAlign: 'center' }}>Close</button>
      </div>
    </div>
  );
}

export default function Shop() {
  const { canClaim, hasPack, coins, packCost, gigaPackCost, foodPackCost, toyPackCost, animalPackCost, envPackCost, claimPack, buyPack, buyGigaPack, buyFoodPack, buyToyPack, buyAnimalPack, buyEnvPack } = useGame();
  const [timeLeft, setTimeLeft] = useState('');
  const [showPayout, setShowPayout] = useState(false);

  useEffect(() => {
    if (canClaim) return;
    const tick = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow - now;
      if (diff <= 0) { return; }
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
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="action-btn" onClick={() => setShowPayout(true)}>📊 Payout</button>
          <div className="coin-display">
            <span>🪙</span>
            <span className="coin-amount">{coins}</span>
          </div>
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

        <div className="shop-pack-card">
          <div className="pack-icon">🌍</div>
          <h3>Environment Pack</h3>
          <p>1 random environment — {envPackCost} coins</p>
          <button
            className={`claim-btn${coins >= envPackCost && !hasPack ? '' : ' disabled'}`}
            onClick={() => coins >= envPackCost && !hasPack && buyEnvPack()}
            disabled={coins < envPackCost || hasPack}
          >
            {hasPack ? 'Open Current Pack First' : coins >= envPackCost ? `Buy — ${envPackCost}🪙` : 'Not Enough Coins'}
          </button>
        </div>
      </div>

      {showPayout && <PayoutModal onClose={() => setShowPayout(false)} />}
    </div>
  );
}
