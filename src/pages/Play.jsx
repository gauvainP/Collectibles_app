import { useState, useCallback, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { ANIMALS, DIET_MAP, getAnimalById } from '../data/cards';

const TABS = [
  { id: 'memory', label: 'Memory', emoji: '🧠' },
  { id: 'mines', label: 'Mines', emoji: '💣' },
  { id: 'slots', label: 'Slots', emoji: '🎰' },
  { id: 'agejack', label: 'Age Jack', emoji: '🃏' },
  { id: 'vegan', label: 'Vegan or Not', emoji: '🥦' },
];

// --- Memory Game ---

const PAIRS = [
  { id: 'lion', emoji: '🦁' },
  { id: 'tiger', emoji: '🐯' },
  { id: 'elephant', emoji: '🐘' },
  { id: 'giraffe', emoji: '🦒' },
  { id: 'panda', emoji: '🐼' },
  { id: 'fox', emoji: '🦊' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initMemoryCards() {
  const cards = [];
  PAIRS.forEach(p => {
    cards.push({ uid: p.id + '_a', pairId: p.id, emoji: p.emoji, flipped: false, matched: false });
    cards.push({ uid: p.id + '_b', pairId: p.id, emoji: p.emoji, flipped: false, matched: false });
  });
  return shuffle(cards);
}

function MemoryGame({ coins, onEntry, onReward }) {
  const [cards, setCards] = useState(() => initMemoryCards());
  const [flipped, setFlipped] = useState([]);
  const [lives, setLives] = useState(4);
  const [gameState, setGameState] = useState('menu');
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
          if (newMatched === PAIRS.length) {
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

  const startGame = () => {
    if (coins < 25) return;
    onEntry();
    setCards(initMemoryCards());
    setFlipped([]);
    setLives(4);
    setGameState('playing');
    setRewardClaimed(false);
    setLocked(false);
  };

  const claimReward = () => {
    onReward(100);
    setRewardClaimed(true);
  };

  const restart = () => {
    setCards(initMemoryCards());
    setFlipped([]);
    setLives(4);
    setGameState('menu');
    setRewardClaimed(false);
    setLocked(false);
  };

  if (gameState === 'menu') {
    return (
      <div className="mines-menu">
        <div className="mines-menu-icon">🧠</div>
        <h2>Memory</h2>
        <p>Match all {PAIRS.length} pairs — cost 25 coins</p>
        <p>❤️ 4 lives &nbsp; 🎯 {PAIRS.length * 2} cards</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>Win 100 coins if you match them all!</p>
        <button
          className="claim-btn"
          onClick={startGame}
          disabled={coins < 25}
          style={{ marginTop: 16 }}
        >
          {coins >= 25 ? 'Play — 25🪙' : 'Not Enough Coins'}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="memory-stats">
        <span>❤️{'❤️'.repeat(lives)}{'🖤'.repeat(4 - lives)}</span>
        <span>🎯 {matchedCount}/{PAIRS.length} pairs</span>
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

// --- Mines Game ---

const MINE_CARDS = [
  { type: 'butterfly', emoji: '🦋', value: 10 },
  { type: 'butterfly', emoji: '🦋', value: 10 },
  { type: 'butterfly', emoji: '🦋', value: 10 },
  { type: 'butterfly', emoji: '🦋', value: 10 },
  { type: 'butterfly', emoji: '🦋', value: 10 },
  { type: 'butterfly', emoji: '🦋', value: 10 },
  { type: 'butterfly', emoji: '🦋', value: 10 },
  { type: 'elephant', emoji: '🐘', value: 100 },
  { type: 'mine', emoji: '💣', value: 0 },
];

function shuffleCards(arr) {
  const a = arr.map((c, i) => ({ ...c, idx: i }));
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function MinesGame({ coins, onEntry, onReward }) {
  const [phase, setPhase] = useState('menu');
  const [cards, setCards] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [winnings, setWinnings] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [collected, setCollected] = useState(false);

  const startGame = () => {
    if (coins < 100) return;
    onEntry();
    setCards(shuffleCards(MINE_CARDS));
    setRevealed([]);
    setWinnings(0);
    setGameOver(false);
    setCollected(false);
    setPhase('playing');
  };

  const revealCard = (idx) => {
    if (gameOver || collected || revealed.includes(idx)) return;
    const card = cards[idx];
    const nextRevealed = [...revealed, idx];
    setRevealed(nextRevealed);

    if (card.type === 'mine') {
      setGameOver(true);
      setWinnings(0);
    } else {
      const newWinnings = winnings + card.value;
      setWinnings(newWinnings);
    }
  };

  const cashOut = () => {
    if (winnings <= 0) return;
    onReward(winnings);
    setCollected(true);
  };

  const remaining = cards.filter((_, i) => !revealed.includes(i));
  const minesRemaining = remaining.filter(c => c.type === 'mine').length;
  const safeRemaining = remaining.filter(c => c.type !== 'mine').length;

  if (phase === 'menu') {
    return (
      <div className="mines-menu">
        <div className="mines-menu-icon">💣</div>
        <h2>Mines</h2>
        <p>Pay 100 coins to reveal cards from a 3×3 grid.</p>
        <p>🦋 Butterfly = +10 coins &nbsp; 🐘 Elephant = +100 coins</p>
        <p>💣 Hit the mine = lose everything!</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
          Reveal one card at a time. Cash out anytime to keep your winnings. 
          <br />8 safe cards, 1 mine. The more you reveal, the higher the risk!
        </p>
        <button
          className="claim-btn"
          onClick={startGame}
          disabled={coins < 100}
          style={{ marginTop: 16 }}
        >
          {coins >= 100 ? 'Play — 100🪙' : 'Not Enough Coins'}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mines-stats">
        <span>🪙 Winnings: {winnings}</span>
        <span>💣 {minesRemaining} mine{minesRemaining !== 1 ? 's' : ''} left</span>
        <span>🦋 {safeRemaining} safe</span>
      </div>

      {gameOver && (
        <div className="memory-result">
          <div className="memory-result-emoji">💥</div>
          <h2>You hit a mine!</h2>
          <p>You lost everything!</p>
          <button className="action-btn" style={{ marginTop: 16 }} onClick={startGame}>
            Play Again — 100🪙
          </button>
        </div>
      )}

      {collected && (
        <div className="memory-result">
          <div className="memory-result-emoji">💰</div>
          <h2>Cashed Out!</h2>
          <p>You collected {winnings} coins!</p>
          <button className="action-btn" style={{ marginTop: 16 }} onClick={startGame}>
            Play Again — 100🪙
          </button>
        </div>
      )}

      {!gameOver && !collected && winnings > 0 && (
        <button className="claim-btn mines-cashout" onClick={cashOut}>
          Cash Out — {winnings}🪙
        </button>
      )}

      <div className="mines-grid">
        {cards.map((card, i) => {
          const isRevealed = revealed.includes(i);
          let cls = 'mine-card';
          if (isRevealed) {
            cls += ' revealed';
            if (card.type === 'mine') cls += ' mine-hit';
            else cls += ' safe';
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => revealCard(i)}
              disabled={isRevealed || gameOver || collected}
            >
              {isRevealed ? card.emoji : '❓'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Slot Game ---

const SYMBOLS = [
  { id: 'cat', emoji: '🐈', payout: 100 },
  { id: 'butterfly', emoji: '🦋', payout: 200 },
  { id: 'elephant', emoji: '🐘', payout: 300 },
];

const REEL_IDS = [0, 1, 2];

function SlotGame({ coins, slotCost, onSpin }) {
  const [reels, setReels] = useState(REEL_IDS.map(() => null));
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const intervalRef = useRef(null);

  const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * 3)];

  const spin = () => {
    if (coins < slotCost || spinning) return;
    setResult(null);
    setMessage('');

    const fr = REEL_IDS.map(() => getRandomSymbol());
    let tick = 0;

    intervalRef.current = setInterval(() => {
      tick++;
      setReels(REEL_IDS.map(() => getRandomSymbol()));

      if (tick >= 10) {
        clearInterval(intervalRef.current);
        setReels(fr);
        setSpinning(false);

        const win = fr[0].id === fr[1].id && fr[1].id === fr[2].id;
        const payout = win ? fr[0].payout : 0;
        onSpin(payout);
        if (win) {
          setResult('win');
          setMessage(`🎉 Jackpot! +${payout} coins!`);
        } else {
          setResult('lose');
          setMessage('No match. Try again!');
        }
      }
    }, 100);
  };

  return (
    <div className="slot-container">
      <div className="slot-header">
        <h2>🎰 Slot Machine</h2>
        <p>Pay {slotCost} coins — match 3 to win!</p>
      </div>

      <div className="slot-payouts">
        {SYMBOLS.map(s => (
          <div key={s.id} className="slot-payout-info">
            <span className="slot-payout-cards">{s.emoji} {s.emoji} {s.emoji}</span>
            <span className="slot-payout-amount">+{s.payout}🪙</span>
          </div>
        ))}
      </div>

      <div className="slot-machine-frame">
        <div className="slot-reels">
          {REEL_IDS.map(i => (
            <div key={i} className={`slot-reel${spinning ? ' spinning' : ''}`}>
              <div className="slot-card">
                {reels[i] ? (
                  <>
                    <span className="slot-card-emoji">{reels[i].emoji}</span>
                    <span className="slot-card-name">{reels[i].id}</span>
                  </>
                ) : (
                  <span className="slot-card-emoji">🎰</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {message && (
        <div className={`slot-message ${result}`}>
          {message}
        </div>
      )}

      <button
        className="claim-btn"
        onClick={spin}
        disabled={coins < slotCost || spinning}
        style={{ marginTop: 16 }}
      >
        {spinning ? 'Spinning...' : coins >= slotCost ? `Spin — ${slotCost}🪙` : 'Not Enough Coins'}
      </button>
    </div>
  );
}

// --- Age Jack Game ---

function shuffleDeck() {
  const d = ANIMALS.map(a => ({ ...a }));
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

function AgeJackGame({ coins, onEntry, onReward }) {
  const [phase, setPhase] = useState('menu');
  const [bet, setBet] = useState(100);
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [dealerHidden, setDealerHidden] = useState(true);
  const [playerDone, setPlayerDone] = useState(false);
  const [result, setResult] = useState(null);
  const [payout, setPayout] = useState(0);
  const rewardPaid = useRef(false);

  useEffect(() => {
    if (result && payout > 0 && !rewardPaid.current) {
      rewardPaid.current = true;
      onReward(payout);
    }
    if (!result) rewardPaid.current = false;
  }, [result, payout, onReward]);

  const startGame = (selectedBet) => {
    const b = selectedBet || bet;
    if (coins < b) return;
    onEntry(b);
    setBet(b);
    const d = shuffleDeck();
    const pHand = [d.pop()];
    const dHand = [d.pop()];
    setDeck(d);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setDealerHidden(true);
    setPlayerDone(false);
    setResult(null);
    setPayout(0);
    setPhase('playing');

    if (pHand[0].lifespan > 100) {
      setResult('bust');
      setPayout(0);
      setPlayerDone(true);
      setDealerHidden(false);
    }
  };

  const hit = () => {
    if (playerDone || phase !== 'playing') return;
    const d = [...deck];
    const card = d.pop();
    const hand = [...playerHand, card];
    setDeck(d);
    setPlayerHand(hand);

    const total = hand.reduce((s, c) => s + c.lifespan, 0);
    if (total > 100) {
      setResult('bust');
      setPayout(0);
      setPlayerDone(true);
    } else if (total === 100) {
      setPlayerDone(true);
      dealerPlay(hand, d, dealerHand);
    }
  };

  const stand = () => {
    if (playerDone || phase !== 'playing') return;
    setPlayerDone(true);
    dealerPlay(playerHand, deck, dealerHand);
  };

  const dealerPlay = (currentPlayerHand, remainingDeck, currentDealerHand) => {
    setDealerHidden(false);
    let d = [...remainingDeck];
    let hand = [...currentDealerHand];

    const draw = () => {
      if (hand.reduce((s, c) => s + c.lifespan, 0) < 70) {
        const card = d.pop();
        hand = [...hand, card];
        setDealerHand(hand);
        setDeck(d);
        setTimeout(draw, 600);
      } else {
        const dTotal = hand.reduce((s, c) => s + c.lifespan, 0);
        const pTotal = currentPlayerHand.reduce((s, c) => s + c.lifespan, 0);
        resolve(pTotal, dTotal);
      }
    };
    setTimeout(draw, 600);
  };

  const resolve = (pTotal, dTotal) => {
    if (dTotal > 100) {
      if (pTotal === 100) {
        setResult('jackpot');
        setPayout(1000);
      } else {
        setResult('win');
        setPayout(bet * 2);
      }
    } else if (pTotal > dTotal) {
      if (pTotal === 100) {
        setResult('jackpot');
        setPayout(1000);
      } else {
        setResult('win');
        setPayout(bet * 2);
      }
    } else if (pTotal === dTotal) {
      if (pTotal === 100) {
        setResult('jackpot');
        setPayout(1000);
      } else {
        setResult('push');
        setPayout(0);
      }
    } else {
      setResult('lose');
      setPayout(0);
    }
  };

  const BETS = [100, 200, 300];

  if (phase === 'menu') {
    return (
      <div className="mines-menu">
        <div className="mines-menu-icon">🃏</div>
        <h2>Age Jack</h2>
        <p>Draw animal cards. Get as close to <strong>100 years</strong> without going over!</p>
        <p>🐘 Each animal's lifespan is its card value</p>
        <p>🃏 Dealer stops at 70</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
          Win 2× your bet | Exact 100 = 1000🪙 Jackpot!
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
          {BETS.map(b => (
            <button
              key={b}
              className="claim-btn"
              onClick={() => startGame(b)}
              disabled={coins < b}
              style={{ opacity: coins < b ? 0.4 : 1 }}
            >
              {coins >= b ? `Play — ${b}🪙` : 'Not Enough Coins'}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const pTotal = playerHand.reduce((s, c) => s + c.lifespan, 0);
  const dTotal = dealerHand.reduce((s, c) => s + c.lifespan, 0);

  return (
    <div className="agejack-container">
      <div className="agejack-table">
        <div className="agejack-section">
          <div className="agejack-label">
            Dealer {playerDone && !dealerHidden ? `(${dTotal}y)` : ''}
          </div>
          <div className="agejack-hand">
            {dealerHand.map((card, i) => (
              <div key={i} className={`aj-card${i === 0 && dealerHidden ? ' hidden' : ''}`}>
                {i === 0 && dealerHidden ? (
                  <>
                    <span className="aj-card-back">?</span>
                  </>
                ) : (
                  <>
                    <span className="aj-card-emoji">{card.emoji}</span>
                    <span className="aj-card-name">{card.name}</span>
                    <span className="aj-card-value">{card.lifespan}y</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="aj-divider" />

        <div className="agejack-section">
          <div className="agejack-label">
            You ({pTotal}y)
            <span className={`aj-status ${result}`}>
              {result === 'win' && ' WIN'}
              {result === 'jackpot' && ' 🎉JACKPOT!🎉'}
              {result === 'bust' && ' BUST'}
              {result === 'push' && ' PUSH'}
              {result === 'lose' && ' LOSE'}
            </span>
          </div>
          <div className="agejack-hand">
            {playerHand.map((card, i) => (
              <div key={i} className="aj-card">
                <span className="aj-card-emoji">{card.emoji}</span>
                <span className="aj-card-name">{card.name}</span>
                <span className="aj-card-value">{card.lifespan}y</span>
              </div>
            ))}
          </div>
        </div>

        <div className="aj-total-bar">
          <div className="aj-total-fill" style={{ width: `${Math.min(100, (pTotal / 100) * 100)}%` }} />
          <span className="aj-total-text">{pTotal}/100</span>
        </div>
      </div>

      {result && (
        <div className="agejack-result">
          {result === 'win' && <p>🎉 You win! +{bet * 2}🪙</p>}
          {result === 'jackpot' && <p>🎊 JACKPOT! Exact 100! +1000🪙</p>}
          {result === 'bust' && <p>💥 Bust! You went over 100.</p>}
          {result === 'push' && <p>🤝 Push. No one wins.</p>}
          {result === 'lose' && <p>💀 Dealer wins with {dTotal}y.</p>}
          <button className="claim-btn" style={{ marginTop: 12 }} onClick={() => startGame(bet)}>
            Play Again — {bet}🪙
          </button>
        </div>
      )}

      {!result && (
        <div className="agejack-actions">
          <button className="claim-btn" onClick={hit} disabled={playerDone}>
            Hit 🃏
          </button>
          <button className="action-btn" onClick={stand} disabled={playerDone}>
            Stand ✋
          </button>
        </div>
      )}
    </div>
  );
}

// --- Vegan or Not ---

const VEGAN_MEAT_EATERS = ['lion', 'fox', 'wolf', 'tiger', 'eagle', 'shark', 'dolphin', 'owl', 'phoenix', 'penguin'];
const VEGAN_VEGAN = ['elephant', 'giraffe', 'monkey', 'panda', 'butterfly', 'turtle', 'rabbit', 'bear', 'horse', 'sheep', 'parrot', 'peacock'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function VeganOrNotGame({ coins, onEntry, onReward }) {
  const [phase, setPhase] = useState('menu');
  const [bet, setBet] = useState(100);
  const [card, setCard] = useState(null);
  const [result, setResult] = useState(null);
  const [payout, setPayout] = useState(0);
  const rewardPaid = useRef(false);

  useEffect(() => {
    if (result && payout > 0 && !rewardPaid.current) {
      rewardPaid.current = true;
      onReward(payout);
    }
    if (!result) rewardPaid.current = false;
  }, [result, payout, onReward]);

  const drawCard = () => {
    const isDragon = Math.random() < 0.01;
    if (isDragon) return { id: 'dragon', name: 'Dragon', emoji: '🐉', eatsMeat: true };
    const isMeat = Math.random() < 0.5;
    const pool = isMeat ? VEGAN_MEAT_EATERS : VEGAN_VEGAN;
    const animalId = pick(pool);
    const def = getAnimalById(animalId);
    return { id: animalId, name: def.name, emoji: def.emoji, eatsMeat: isMeat };
  };

  const startGame = (selectedBet) => {
    if (coins < selectedBet) return;
    onEntry(selectedBet);
    setBet(selectedBet);
    setCard(drawCard());
    setResult(null);
    setPayout(0);
    setPhase('playing');
  };

  const guess = (saysMeat) => {
    if (!card || result) return;
    if (card.id === 'dragon') {
      setResult('dragon');
      setPayout(bet * 10);
    } else if (card.eatsMeat === saysMeat) {
      setResult('win');
      setPayout(Math.floor(bet * 1.75));
    } else {
      setResult('lose');
      setPayout(0);
    }
  };

  const BETS = [100, 300];

  if (phase === 'menu') {
    return (
      <div className="mines-menu">
        <div className="mines-menu-icon">🥦</div>
        <h2>Vegan or Not</h2>
        <p>A card is drawn face down. Guess if it eats meat or not!</p>
        <p>🥩 2 meat-eaters &nbsp; 🌿 2 herbivores in the deck</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
          Correct guess: 1.75× your bet &nbsp; | &nbsp; 🐉 1% Dragon: 10× Jackpot!
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
          {BETS.map(b => (
            <button
              key={b}
              className="claim-btn"
              onClick={() => startGame(b)}
              disabled={coins < b}
              style={{ opacity: coins < b ? 0.4 : 1 }}
            >
              {coins >= b ? `Play — ${b}🪙` : 'Not Enough Coins'}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="vegan-container" style={{ textAlign: 'center' }}>
      {!result && (
        <>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>What does this animal eat?</p>
          <div className="aj-card" style={{ margin: '0 auto', width: 100, minHeight: 100, justifyContent: 'center' }}>
            <span style={{ fontSize: 32 }}>🃏</span>
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24 }}>
            <button className="claim-btn" onClick={() => guess(true)}>🥩 Meat</button>
            <button className="claim-btn" onClick={() => guess(false)} style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>🌿 Vegan</button>
          </div>
        </>
      )}

      {result && (
        <div>
          <div className="aj-card" style={{ margin: '0 auto', width: 100, minHeight: 100, justifyContent: 'center' }}>
            <span style={{ fontSize: 40 }}>{card.emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{card.name}</span>
            <span style={{ fontSize: 12, color: card.eatsMeat ? '#EF4444' : '#10B981' }}>
              {card.eatsMeat ? '🥩 Eats meat' : '🌿 Herbivore'}
            </span>
          </div>
          <div style={{ marginTop: 16 }}>
            {result === 'dragon' && <p style={{ fontSize: 20, fontWeight: 800, color: '#F59E0B' }}>🐉 DRAGON! +{bet * 10}🪙</p>}
            {result === 'win' && <p style={{ fontSize: 18, fontWeight: 700, color: '#10B981' }}>🎉 Correct! +{Math.floor(bet * 1.9)}🪙</p>}
            {result === 'lose' && <p style={{ fontSize: 18, fontWeight: 700, color: '#EF4444' }}>💀 Wrong! Lost {bet}🪙</p>}
          </div>
          <button className="claim-btn" style={{ marginTop: 16 }} onClick={() => setPhase('menu')}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// --- Play Page ---

export default function Play() {
  const { coins, claimMemoryReward, memoryEntry, minesEntry, minesReward, slotSpin, slotCost, ageJackEntry, ageJackReward } = useGame();
  const [tab, setTab] = useState('memory');

  return (
    <div className="page">
      <h1 className="page-title">Play Games</h1>
      <p className="page-subtitle">Test your skills and earn coins!</p>

      <div className="game-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`game-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <div className="game-content">
        <div className="game-coins">🪙 {coins}</div>
        {tab === 'memory' && <MemoryGame coins={coins} onEntry={memoryEntry} onReward={() => claimMemoryReward()} />}
        {tab === 'mines' && <MinesGame coins={coins} onEntry={minesEntry} onReward={minesReward} />}
        {tab === 'slots' && <SlotGame coins={coins} slotCost={slotCost} onSpin={slotSpin} />}
        {tab === 'agejack' && <AgeJackGame coins={coins} onEntry={ageJackEntry} onReward={ageJackReward} />}
        {tab === 'vegan' && <VeganOrNotGame coins={coins} onEntry={ageJackEntry} onReward={ageJackReward} />}
      </div>
    </div>
  );
}
