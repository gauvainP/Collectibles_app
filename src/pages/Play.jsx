import { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';

const PAIRS = [
  { id: 'lion', emoji: '🦁' },
  { id: 'tiger', emoji: '🐯' },
  { id: 'elephant', emoji: '🐘' },
  { id: 'giraffe', emoji: '🦒' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initCards() {
  const cards = [];
  PAIRS.forEach(p => {
    cards.push({ uid: p.id + '_a', pairId: p.id, emoji: p.emoji, flipped: false, matched: false });
    cards.push({ uid: p.id + '_b', pairId: p.id, emoji: p.emoji, flipped: false, matched: false });
  });
  return shuffle(cards);
}

export default function Play() {
  const { coins, claimMemoryReward } = useGame();
  const [cards, setCards] = useState(() => initCards());
  const [flipped, setFlipped] = useState([]);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState('playing');
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [locked, setLocked] = useState(false);

  const matchedCount = cards.filter(c => c.matched).length / 2;

  const flipCard = useCallback((uid) => {
    if (locked || gameState !== 'playing') return;
    const card = cards.find(c => c.uid === uid);
    if (!card || card.flipped || card.matched) return;

    const nextCards = cards.map(c => c.uid === uid ? { ...c, flipped: true } : c);
    const nextFlipped = [...flipped, uid];
    setCards(nextCards);
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setLocked(true);
      const [a, b] = nextFlipped.map(id => nextCards.find(c => c.uid === id));

      if (a.pairId === b.pairId) {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.uid === a.uid || c.uid === b.uid ? { ...c, matched: true } : c));
          setFlipped([]);
          setLocked(false);

          const newMatched = cards.filter(c => c.matched).length / 2 + 1;
          if (newMatched === 4) {
            setGameState('won');
          }
        }, 400);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.uid === a.uid || c.uid === b.uid ? { ...c, flipped: false } : c));
          setFlipped([]);
          const nextLives = lives - 1;
          setLives(nextLives);
          setLocked(false);
          if (nextLives <= 0) {
            setGameState('lost');
          }
        }, 900);
      }
    }
  }, [cards, flipped, lives, locked, gameState]);

  const claimReward = () => {
    claimMemoryReward();
    setRewardClaimed(true);
  };

  const restart = () => {
    setCards(initCards());
    setFlipped([]);
    setLives(3);
    setGameState('playing');
    setRewardClaimed(false);
    setLocked(false);
  };

  return (
    <div className="page">
      <h1 className="page-title">Memory Game</h1>
      <p className="page-subtitle">Match all 4 pairs to earn 100 coins!</p>

      <div className="memory-stats">
        <span>❤️{'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}</span>
        <span>🎯 {matchedCount}/4 pairs</span>
        <span>🪙 {coins}</span>
      </div>

      {gameState !== 'playing' && (
        <div className="memory-result">
          {gameState === 'won' && (
            <>
              <div className="memory-result-emoji">🎉</div>
              <h2>You Win!</h2>
              <p>All pairs matched!</p>
              {!rewardClaimed ? (
                <button className="claim-btn" onClick={claimReward} style={{ marginTop: 16 }}>
                  Claim 100 Coins 🪙
                </button>
              ) : (
                <p style={{ marginTop: 12, color: 'var(--green)', fontWeight: 700 }}>+100 coins awarded!</p>
              )}
            </>
          )}
          {gameState === 'lost' && (
            <>
              <div className="memory-result-emoji">💀</div>
              <h2>Game Over</h2>
              <p>You ran out of lives!</p>
            </>
          )}
          <button className="action-btn" style={{ marginTop: 16 }} onClick={restart}>
            Play Again
          </button>
        </div>
      )}

      <div className="memory-grid">
        {cards.map(card => (
          <button
            key={card.uid}
            className={`memory-card${card.flipped || card.matched ? ' flipped' : ''}${card.matched ? ' matched' : ''}`}
            onClick={() => flipCard(card.uid)}
            disabled={card.flipped || card.matched || locked || gameState !== 'playing'}
          >
            <span className="memory-card-back">?</span>
            <span className="memory-card-front">{card.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
