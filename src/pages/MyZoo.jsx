import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { ENVIRONMENTS, getAnimalById, getCompatibleEnvironments } from '../data/cards';

function AnimalDetail({ env, onClose, inventory, onEquip, onRemove }) {
  const animalDef = getAnimalById(env.animal.cardId);
  if (!animalDef) return null;

  const { animal } = env;
  const slots = [
    { key: 'food', label: 'Food', empty: !animal.food, emoji: '🍎', color: '#F97316' },
    { key: 'drink', label: 'Water', empty: !animal.drink, emoji: '💧', color: '#3B82F6' },
    { key: 'toy', label: 'Toy', empty: !animal.toy, emoji: '🎾', color: '#8B5CF6' },
    { key: 'decoration', label: 'Decoration', empty: !animal.decoration, emoji: '✨', color: '#EC4899' },
  ];
  const filled = slots.filter(s => !s.empty).length;
  const starving = env.animal.daysWithoutFood > 0 || env.animal.daysWithoutDrink > 0;
  const happiness = starving ? 0 : filled * 25;

  const equipItems = {
    food: inventory.filter(i => i.type === 'food' && i.category === 'food'),
    drink: inventory.filter(i => i.type === 'food' && i.foodType === 'water'),
    toy: inventory.filter(i => i.type === 'toy' && i.forAnimal === animal.cardId),
    decoration: inventory.filter(i => i.type === 'decoration' && i.envType === env.envType),
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content animal-detail-modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="animal-detail-header">
          <span className="animal-detail-emoji">{animalDef.emoji}</span>
          <h2>
            {animalDef.name}
            <span className="animal-sex">{animal.sex === 'male' ? '♂' : '♀'}</span>
          </h2>
          {!animal.alive && <span className="death-badge">💀 Deceased</span>}
        </div>
        <div className="animal-age-info">
          <span>Age: {animal.age ?? 0}y</span>
          <span className="age-sep">/</span>
          <span>Lifespan: {animal.lifespan ?? 10}y</span>
          <div className="life-bar">
            <div className="life-fill" style={{ width: `${Math.min(100, ((animal.age ?? 0) / (animal.lifespan || 10)) * 100)}%` }} />
          </div>
          <span className="remaining-years">
            {(animal.lifespan || 10) - (animal.age ?? 0)}y remaining
          </span>
        </div>

        {animal.alive && (
          <>
            <div className="happiness-bar-container">
              <div className="happiness-bar">
                <div className="happiness-fill" style={{ width: `${happiness}%` }} />
              </div>
              <span className="happiness-label">{happiness}% Happy</span>
            </div>

            <div className="needs-grid">
              {slots.map(slot => (
                <div key={slot.key} className={`need-slot${slot.empty ? '' : ' filled'}`}>
                  <div className="need-icon" style={{ background: slot.color }}>{slot.emoji}</div>
                  <div className="need-info">
                    <div className="need-label">{slot.label}</div>
                    {slot.empty ? (
                      <div className="need-status empty">Empty</div>
                    ) : (
                      <div className="need-status filled">Equipped</div>
                    )}
                  </div>
                  {slot.empty && equipItems[slot.key].length > 0 && (
                    <button className="equip-btn" onClick={() => onEquip(env.id, equipItems[slot.key][0].uid, slot.key)}>
                      Equip
                    </button>
                  )}
                </div>
              ))}
            </div>

            {env.animal.daysWithoutFood > 0 && (
              <div className="warning" style={{ marginTop: 12 }}>
                ⚠️ No food for {env.animal.daysWithoutFood} day{env.animal.daysWithoutFood > 1 ? 's' : ''}
              </div>
            )}
            {env.animal.daysWithoutDrink > 0 && (
              <div className="warning">
                ⚠️ No water for {env.animal.daysWithoutDrink} day{env.animal.daysWithoutDrink > 1 ? 's' : ''}
              </div>
            )}
          </>
        )}

        {!animal.alive && (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', marginTop: 12 }}>
              {animal.age >= (animal.lifespan || 10)
                ? `This animal passed away from old age at ${animal.age} years.`
                : 'This animal passed away from starvation.'}
            </p>
            <button
              className="claim-btn"
              style={{ marginTop: 16, width: '100%', background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}
              onClick={() => { onRemove(env.id); onClose(); }}
            >
              🗑️ Remove & Free Environment
            </button>
          </>
        )}

        {animal.alive && (
          <button
            className="claim-btn"
            style={{ marginTop: 16, width: '100%', background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}
            onClick={() => { onRemove(env.id); onClose(); }}
          >
            🗑️ Remove Animal & Free Environment
          </button>
        )}
      </div>
    </div>
  );
}

function PlaceEnvironmentModal({ inventory, onPlace, onClose }) {
  const envs = inventory.filter(i => i.type === 'environment');
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 style={{ marginBottom: 16 }}>Place Environment</h2>
        {envs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No environments in inventory. Open packs to find some!</p>
        ) : (
          <div className="inventory-grid">
            {envs.map(item => {
              const envDef = ENVIRONMENTS.find(e => e.id === item.envType);
              return (
                <button key={item.uid} className="inv-item" onClick={() => { onPlace(item.uid); onClose(); }}>
                  <span style={{ fontSize: 32 }}>{envDef?.emoji || '❓'}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{envDef?.name || item.envType}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function PlaceAnimalModal({ environments, inventory, onPlace, onClose }) {
  const animals = inventory.filter(i => i.type === 'animal');
  const emptyEnvs = environments.filter(e => !e.animal && !e.egg);

  const [selectedEnv, setSelectedEnv] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const filteredAnimals = selectedEnv
    ? animals.filter(a => getCompatibleEnvironments(a.cardId).includes(selectedEnv.envType))
    : animals;

  const canPlace = selectedEnv && selectedAnimal &&
    getCompatibleEnvironments(selectedAnimal.cardId).includes(selectedEnv.envType);

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: 500 }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 style={{ marginBottom: 12 }}>Place Animal</h2>

        {!selectedEnv && (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Choose an environment:</p>
            <div className="inventory-grid">
              {emptyEnvs.map(env => {
                const def = ENVIRONMENTS.find(e => e.id === env.envType);
                return (
                  <button key={env.id} className="inv-item" onClick={() => setSelectedEnv(env)}>
                    <span style={{ fontSize: 32 }}>{def?.emoji || '❓'}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{def?.name || env.envType}</span>
                  </button>
                );
              })}
            </div>
            {emptyEnvs.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No empty environments available.</p>
            )}
          </>
        )}

        {selectedEnv && !selectedAnimal && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <button className="back-btn" onClick={() => setSelectedEnv(null)}>← Back</button>
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                Environment: {ENVIRONMENTS.find(e => e.id === selectedEnv.envType)?.name}
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Choose an animal:</p>
            <div className="inventory-grid">
              {filteredAnimals.map(item => {
                const def = getAnimalById(item.cardId);
                return (
                  <button key={item.uid} className="inv-item" onClick={() => setSelectedAnimal(item)}>
                    <span style={{ fontSize: 32 }}>{def?.emoji || '❓'}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{def?.name || item.cardId}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {item.sex === 'male' ? '♂' : '♀'} {item.age ?? '?'}y
                    </span>
                  </button>
                );
              })}
            </div>
            {filteredAnimals.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                No compatible animals for this environment in your inventory.
              </p>
            )}
          </>
        )}

        {canPlace && (
          <button
            className="claim-btn"
            style={{ marginTop: 16, width: '100%' }}
            onClick={() => { onPlace(selectedEnv.id, selectedAnimal.uid); onClose(); }}
          >
            Place {getAnimalById(selectedAnimal.cardId)?.name}
          </button>
        )}
      </div>
    </div>
  );
}

export default function MyZoo() {
  const {
    zoo, inventory, placeEnvironment, placeAnimal, equipItem, clearEnvironment,
    visitors, canClaimZooMoney, claimZooMoney, envCount, maxEnvironments,
    lastVisitors, totalVisitors,
  } = useGame();

  const [selectedEnv, setSelectedEnv] = useState(null);
  const [showPlaceEnv, setShowPlaceEnv] = useState(false);
  const [showPlaceAnimal, setShowPlaceAnimal] = useState(false);
  const [timeToMidnight, setTimeToMidnight] = useState('');

  useEffect(() => {
    function calc() {
      const now = new Date();
      const next = new Date(now);
      next.setDate(next.getDate() + 1);
      next.setHours(0, 0, 0, 0);
      const diff = next - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeToMidnight(`${h}h ${m}m`);
    }
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, []);

  const handleEquip = (envId, invUid, slot) => {
    equipItem(envId, invUid, slot);
  };

  const envs = zoo.environments || [];
  const hasEmptySlot = envs.some(e => !e.animal && !e.egg);
  const hasCompatibleAnimal = inventory.some(i => {
    if (i.type !== 'animal') return false;
    const compat = getCompatibleEnvironments(i.cardId);
    return envs.some(e => !e.animal && compat.includes(e.envType));
  });

  return (
    <div className="page">
      <div className="zoo-header">
        <div>
          <h1 className="page-title">My Zoo</h1>
          <p className="page-subtitle">
            Build your dream zoo — one environment and animal at a time!
          </p>
        </div>
        <div className="zoo-actions-status">
          <span className="action-badge available">🐾 Free Actions</span>
        </div>
      </div>

      <div className="zoo-stats-bar">
        <span>📸 IG Followers: <strong>{totalVisitors}</strong></span>
        {!canClaimZooMoney && lastVisitors > 0 && (
          <span>🕐 Next claim ~{timeToMidnight}</span>
        )}
        {!canClaimZooMoney && lastVisitors > 0 && (
          <span>💰 Last claim: <strong>{lastVisitors}</strong> visitors</span>
        )}
      </div>

      {envs.length === 0 && (
        <div className="zoo-empty-state">
          <div style={{ fontSize: 64, marginBottom: 16 }}>🌿</div>
          <h2>Your Zoo is Empty!</h2>
          <p>Open packs to find environments, then place them here.</p>
          {inventory.some(i => i.type === 'environment') && (
            <button className="claim-btn" style={{ marginTop: 16 }} onClick={() => setShowPlaceEnv(true)}>
              Place Environment
            </button>
          )}
        </div>
      )}

      {envs.length > 0 && (
        <>
          <div className="zoo-actions-bar">
            {inventory.some(i => i.type === 'environment') && envCount < maxEnvironments && (
              <button className="action-btn" onClick={() => setShowPlaceEnv(true)}>
                🌍 Place Environment
              </button>
            )}
            {envCount >= maxEnvironments && (
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                Max environments reached ({maxEnvironments})!
              </span>
            )}
            {hasEmptySlot && hasCompatibleAnimal && (
              <button className="action-btn" onClick={() => setShowPlaceAnimal(true)}>
                🐾 Place Animal
              </button>
            )}
            {!hasEmptySlot && envCount > 0 && (
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                All environments are full! Place a new one to add more animals.
              </span>
            )}
            {visitors > 0 && (
              <button
                className={`action-btn ${!canClaimZooMoney ? 'used' : ''}`}
                onClick={claimZooMoney}
                disabled={!canClaimZooMoney}
                style={!canClaimZooMoney ? { opacity: 0.5 } : {}}
              >
                💰 Claim Zoo Money ({visitors}🪙)
              </button>
            )}
          </div>

          <div className="zoo-grid">
            {envs.map(env => {
              const envDef = ENVIRONMENTS.find(e => e.id === env.envType);
              const isDead = env.animal && !env.animal.alive;
              return (
                <div key={env.id} className={`zoo-env-card${!env.animal ? ' empty' : ''}${isDead ? ' dead' : ''}`}>
                  <div className="env-header">
                    <span className="env-emoji">{envDef?.emoji || '❓'}</span>
                    <span className="env-name">{envDef?.name || env.envType}</span>
                  </div>

                  {env.decoration && (
                    <div className="env-decoration">✨ Decoration placed</div>
                  )}

                  {env.egg && (
                    <div className="env-egg-state">
                      <span>🥚</span>
                      <span>Incubating egg...</span>
                      <span className="egg-hint">Hatches next day</span>
                    </div>
                  )}

                  {!env.animal && !env.egg && (
                    <div className="env-empty-state">
                      <span>🟢</span>
                      <span>Ready for an animal</span>
                    </div>
                  )}

                  {env.animal && (
                    <div className="env-animal" onClick={() => setSelectedEnv(env)}>
                      <div className="env-animal-emoji">
                        {getAnimalById(env.animal.cardId)?.emoji || '❓'}
                        {isDead && <span className="death-skull">💀</span>}
                      </div>
                      <div className="env-animal-name">
                        {getAnimalById(env.animal.cardId)?.name || env.animal.cardId}
                        <span className="animal-sex-icon">
                          {env.animal.sex === 'male' ? '♂' : env.animal.sex === 'female' ? '♀' : ''}
                        </span>
                      </div>
                      <div className="env-animal-age">
                        {env.animal.age ?? 0}y / {env.animal.lifespan ?? 10}y
                      </div>
                      {!isDead && (
                        <>
                          <div className="env-happiness">
                            <div className="env-happiness-bar">
                              <div
                                className="env-happiness-fill"
                                style={{ width: `${(env.animal.daysWithoutFood > 0 || env.animal.daysWithoutDrink > 0) ? 0 : [env.animal.food, env.animal.drink, env.animal.toy, env.animal.decoration].filter(Boolean).length * 25}%` }}
                              />
                            </div>
                          </div>
                          <div className="env-needs-row">
                            <span className={`need-icon ${env.animal.food ? 'filled' : ''}`} title="Food">🍎</span>
                            <span className={`need-icon ${env.animal.drink ? 'filled' : ''}`} title="Water">💧</span>
                            <span className={`need-icon ${env.animal.toy ? 'filled' : ''}`} title="Toy">🎾</span>
                            <span className={`need-icon ${env.animal.decoration ? 'filled' : ''}`} title="Decoration">✨</span>
                          </div>
                        </>
                      )}
                      {isDead && <div className="env-dead-label">Deceased</div>}
                      {!isDead && (env.animal.daysWithoutFood >= 2 || env.animal.daysWithoutDrink >= 2) && (
                        <div className="env-warning">⚠️ Starving!</div>
                      )}
                    </div>
                  )}

                  {(env.animal || env.egg) && (
                    <button className="remove-btn" onClick={() => clearEnvironment(env.id)}>
                      🗑️ Remove & Free Slot
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {(() => {
        const liveEnv = selectedEnv ? zoo.environments.find(e => e.id === selectedEnv.id) || selectedEnv : null;
        return liveEnv && liveEnv.animal ? (
          <AnimalDetail
            env={liveEnv}
            inventory={inventory}
            onClose={() => setSelectedEnv(null)}
            onEquip={handleEquip}
            onRemove={clearEnvironment}
          />
        ) : null;
      })()}

      {showPlaceEnv && (
        <PlaceEnvironmentModal
          inventory={inventory}
          onPlace={placeEnvironment}
          onClose={() => setShowPlaceEnv(false)}
        />
      )}

      {showPlaceAnimal && (
        <PlaceAnimalModal
          environments={envs}
          inventory={inventory}
          onPlace={placeAnimal}
          onClose={() => setShowPlaceAnimal(false)}
        />
      )}
    </div>
  );
}
