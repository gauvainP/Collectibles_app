import { useCallback, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import Card from './Card';

export default function PackOpener() {
  const { packCards, revealedIds, revealCard, revealAll, closePack, collection, allRevealed, hasPack } = useGame();
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    if (!hasPack) { setShowCards(false); return; }
    const t = setTimeout(() => setShowCards(true), 400);
    return () => clearTimeout(t);
  }, [hasPack]);

  const handleReveal = useCallback((uid) => {
    if (!revealedIds.includes(uid)) revealCard(uid);
  }, [revealedIds, revealCard]);

  if (!hasPack || !packCards.length) return null;

  const prevSet = new Set(collection);

  return (
    <div className="pack-overlay" onClick={(e) => { if (e.target === e.currentTarget && allRevealed) closePack(); }}>
      <div className="pack-opening-title">
        {allRevealed ? '✨ Pack Complete! ✨' : 'Click to reveal!'}
      </div>

      {showCards && (
        <div className="pack-cards-grid">
          {packCards.map(item => {
            const revealed = revealedIds.includes(item.uid);
            const isNew = item.type === 'animal' && !prevSet.has(item.cardId);
            return (
              <Card
                key={item.uid}
                item={item}
                revealed={revealed}
                isNew={isNew}
                onClick={() => !revealed && handleReveal(item.uid)}
              />
            );
          })}
        </div>
      )}

      {showCards && !allRevealed && (
        <button className="pack-close-btn claim-all-btn" onClick={revealAll}>
          ⚡ Claim All
        </button>
      )}

      {allRevealed && (
        <button className="pack-close-btn" onClick={closePack}>
          Collect All — Close
        </button>
      )}
    </div>
  );
}
