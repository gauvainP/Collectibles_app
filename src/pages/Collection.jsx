import { useState } from 'react';
import { useGame } from '../context/GameContext';
import {
  ANIMALS, RARITIES, ENVIRONMENTS, FOOD_TYPES, TOY_NAMES,
  getAnimalById, getCompatibleEnvironments,
} from '../data/cards';
import PackOpener from '../components/PackOpener';

const TABS = [
  { id: 'animals', label: 'Animals', emoji: '🐾' },
  { id: 'food', label: 'Food', emoji: '🍎' },
  { id: 'toys', label: 'Toys', emoji: '🎾' },
  { id: 'environments', label: 'Environments', emoji: '🌍' },
];

export default function Collection() {
  const { collection, inventory, hasPack, sellItem, zoo } = useGame();
  const [tab, setTab] = useState('animals');

  return (
    <div className="page">
      <PackOpener />
      <h1 className="page-title">Collection</h1>
      <p className="page-subtitle">Browse all your collected cards and inventory items.</p>

      <div className="collection-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`collection-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.emoji} {t.label}
            {t.id === 'animals' && <span className="tab-count">{collection.length}/{ANIMALS.length}</span>}
            {t.id !== 'animals' && (
              <span className="tab-count">{
                inventory.filter(i => {
                  if (t.id === 'food') return i.type === 'food';
                  if (t.id === 'toys') return i.type === 'toy';
                  if (t.id === 'environments') return i.type === 'environment';
                  return false;
                }).length
              }</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'animals' && <AnimalsTab collection={collection} inventory={inventory} sellItem={sellItem} zoo={zoo} />}
      {tab === 'food' && <FoodTab inventory={inventory} sellItem={sellItem} />}
      {tab === 'toys' && <ToysTab inventory={inventory} sellItem={sellItem} />}
      {tab === 'environments' && <EnvironmentsTab inventory={inventory} sellItem={sellItem} />}
    </div>
  );
}

function AnimalsTab({ collection, inventory, sellItem, zoo }) {
  const everOwnedSet = new Set(collection);
  const inventoryAnimalIds = new Set(inventory.filter(i => i.type === 'animal').map(i => i.cardId));
  const zooAnimalIds = new Set(zoo.environments.filter(e => e.animal).map(e => e.animal.cardId));
  const currentlyOwned = new Set([...inventoryAnimalIds, ...zooAnimalIds]);

  const total = ANIMALS.length;
  const owned = currentlyOwned.size;
  const pct = Math.round((owned / total) * 100);
  const [selected, setSelected] = useState(null);

  const animalCounts = {};
  inventory.filter(i => i.type === 'animal').forEach(i => {
    animalCounts[i.cardId] = (animalCounts[i.cardId] || 0) + 1;
  });

  const sorted = [...ANIMALS].sort((a, b) => {
    const order = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
    const aOwned = currentlyOwned.has(a.id) ? 0 : 1;
    const bOwned = currentlyOwned.has(b.id) ? 0 : 1;
    if (aOwned !== bOwned) return aOwned - bOwned;
    return (order[a.rarity] || 5) - (order[b.rarity] || 5);
  });

  return (
    <>
      <div className="collection-header">
        <div className="collection-progress">
          <div className="progress-text">{owned}/{total} ({pct}%)</div>
          <div className="progress-bar" style={{ width: 200 }}>
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="collection-grid">
        {sorted.map(card => {
          const own = currentlyOwned.has(card.id);
          const rarity = RARITIES[card.rarity];
          const count = animalCounts[card.id] || 0;
          return (
            <div
              key={card.id}
              className={`collection-card${own ? ' owned' : ''}`}
              onClick={() => setSelected(card)}
            >
              {own && <div className="check-mark">✓</div>}
              {count > 0 && (
                <button
                  className="sell-btn"
                  onClick={(e) => { e.stopPropagation(); sellItem('animal', { cardId: card.id }); }}
                >
                  $
                </button>
              )}
              <div className="card-emoji">{card.emoji}</div>
              <div className="card-name">{own ? card.name : '???'}</div>
              <div>
                <span className="rarity-dot" style={{ background: rarity.color }} />
                <span className="rarity-label" style={{ color: rarity.color }}>
                  {own ? rarity.name : '???'}
                </span>
              </div>
              {count > 0 && <div className="inv-count">×{count} in inventory</div>}
            </div>
          );
        })}
      </div>

      {selected && (
        <AnimalInfoModal
          animal={selected}
          owned={currentlyOwned.has(selected.id)}
          everOwned={everOwnedSet.has(selected.id)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

function AnimalInfoModal({ animal, owned, everOwned, onClose }) {
  const rarity = RARITIES[animal.rarity];
  const compatEnvs = getCompatibleEnvironments(animal.id);
  const toy = TOY_NAMES[animal.id];

  const diet = [];
  if (['lion', 'tiger', 'fox', 'wolf', 'eagle', 'shark', 'dolphin', 'dragon'].includes(animal.id)) {
    diet.push({ emoji: '🥩', name: 'Meat' });
  }
  if (['elephant', 'giraffe', 'monkey', 'panda', 'butterfly', 'turtle', 'rabbit', 'bear', 'horse', 'sheep', 'parrot'].includes(animal.id)) {
    diet.push({ emoji: '🌿', name: 'Grass/Plants' });
  }
  if (['monkey', 'bear', 'parrot', 'butterfly'].includes(animal.id)) {
    diet.push({ emoji: '🍎', name: 'Fruits' });
  }
  if (['cat', 'dog', 'rabbit', 'horse', 'sheep'].includes(animal.id)) {
    diet.push({ emoji: '🍪', name: 'Treat' });
  }
  if (['owl', 'phoenix', 'dragon', 'penguin'].includes(animal.id)) {
    diet.push({ emoji: '🥩', name: 'Meat' });
  }
  if (!diet.length) diet.push({ emoji: '🍽️', name: 'Omnivore' });

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content animal-info-modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="info-header">
          <span className="info-emoji">{animal.emoji}</span>
          <h2>{animal.name}</h2>
          {owned && <span className="owned-badge">✓ Collected</span>}
          {!owned && everOwned && <span className="once-owned-badge">⟳ Once Owned</span>}
          {!owned && !everOwned && <span className="missing-badge">??? Not Collected</span>}
        </div>

        <div className="info-section">
          <div className="info-label">Rarity</div>
          <div className="info-value">
            <span className="rarity-dot" style={{ background: rarity.color }} />
            <span style={{ color: rarity.color, fontWeight: 600 }}>{rarity.name}</span>
            <span style={{ color: rarity.color, marginLeft: 8 }}>{'★'.repeat(rarity.stars)}</span>
          </div>
        </div>

        <div className="info-section">
          <div className="info-label">Compatible Environments</div>
          <div className="info-tags">
            {compatEnvs.length === 0 && <span className="muted">None</span>}
            {compatEnvs.map(eid => {
              const edef = ENVIRONMENTS.find(e => e.id === eid);
              return edef ? (
                <span key={eid} className="info-tag">{edef.emoji} {edef.name}</span>
              ) : null;
            })}
          </div>
        </div>

        <div className="info-section">
          <div className="info-label">Diet</div>
          <div className="info-tags">
            {diet.map((d, i) => (
              <span key={i} className="info-tag">{d.emoji} {d.name}</span>
            ))}
          </div>
        </div>

        {toy && (
          <div className="info-section">
            <div className="info-label">Favorite Toy</div>
            <div className="info-tags">
              <span className="info-tag">{toy.emoji} {toy.name}</span>
            </div>
          </div>
        )}

        <div className="info-section">
          <div className="info-label">Needs</div>
          <div className="info-needs">
            <span>🍎 Food</span>
            <span>💧 Water</span>
            <span>🎾 Toy</span>
            <span>✨ Decoration</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FoodTab({ inventory, sellItem }) {
  const foods = inventory.filter(i => i.type === 'food');
  const foodDefs = FOOD_TYPES;

  if (foods.length === 0) {
    return <EmptyTab message="No food items in your inventory. Open packs to find some!" />;
  }

  const grouped = {};
  foods.forEach(f => {
    if (!grouped[f.foodType]) grouped[f.foodType] = [];
    grouped[f.foodType].push(f);
  });

  return (
    <div className="inventory-tab-grid">
      {foodDefs.map(def => {
        const count = (grouped[def.id] || []).length;
        if (count === 0) return null;
        return (
          <div key={def.id} className="inv-display-card">
            <button
              className="sell-btn"
              onClick={() => sellItem('food', { foodType: def.id })}
            >
              $
            </button>
            <div className="inv-display-emoji">{def.emoji}</div>
            <div className="inv-display-name">{def.name}</div>
            <div className="inv-display-count">x{count}</div>
            <div className="inv-display-type">{def.category === 'drink' ? '💧 Drink' : '🍽️ Food'}</div>
          </div>
        );
      })}
    </div>
  );
}

function ToysTab({ inventory, sellItem }) {
  const toys = inventory.filter(i => i.type === 'toy');

  if (toys.length === 0) {
    return <EmptyTab message="No toys in your inventory. Open packs to find some!" />;
  }

  const grouped = {};
  toys.forEach(t => {
    if (!grouped[t.forAnimal]) grouped[t.forAnimal] = [];
    grouped[t.forAnimal].push(t);
  });

  return (
    <div className="inventory-tab-grid">
      {Object.entries(grouped).map(([animalId, items]) => {
        const animal = getAnimalById(animalId);
        const toyDef = TOY_NAMES[animalId];
        return (
          <div key={animalId} className="inv-display-card">
            <button
              className="sell-btn"
              onClick={() => sellItem('toy', { forAnimal: animalId })}
            >
              $
            </button>
            <div className="inv-display-emoji">{toyDef?.emoji || '🎾'}</div>
            <div className="inv-display-name">{toyDef?.name || 'Toy'}</div>
            <div className="inv-display-count">x{items.length}</div>
            <div className="inv-display-type">For: {animal?.emoji || '❓'} {animal?.name || animalId}</div>
          </div>
        );
      })}
    </div>
  );
}

function EnvironmentsTab({ inventory, sellItem }) {
  const envs = inventory.filter(i => i.type === 'environment');

  if (envs.length === 0) {
    return <EmptyTab message="No environments in your inventory. Open packs to find some!" />;
  }

  const grouped = {};
  envs.forEach(e => {
    if (!grouped[e.envType]) grouped[e.envType] = [];
    grouped[e.envType].push(e);
  });

  return (
    <div className="inventory-tab-grid">
      {ENVIRONMENTS.map(def => {
        const count = (grouped[def.id] || []).length;
        if (count === 0) return null;
        return (
          <div key={def.id} className="inv-display-card">
            <button
              className="sell-btn"
              onClick={() => sellItem('environment', { envType: def.id })}
            >
              $
            </button>
            <div className="inv-display-emoji">{def.emoji}</div>
            <div className="inv-display-name">{def.name}</div>
            <div className="inv-display-count">x{count}</div>
            <div className="inv-display-type">🌍 Environment</div>
            <div className="inv-display-sub">{def.description}</div>
          </div>
        );
      })}
    </div>
  );
}

function EmptyTab({ message }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
      <p>{message}</p>
    </div>
  );
}
