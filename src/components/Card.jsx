import { RARITIES, FOOD_TYPES, ENV_DECORATIONS, TOY_NAMES, ENVIRONMENTS, getAnimalById } from '../data/cards';

export default function Card({ item, revealed, isNew, onClick }) {
  let color = '#9CA3AF';
  let stars = 0;
  let name = item.name || '???';
  let emoji = item.emoji || '❓';
  let rarityLabel = '';

  if (item.type === 'animal') {
    const rarity = RARITIES[item.rarity];
    color = rarity.color;
    stars = rarity.stars;
    rarityLabel = rarity.name;
    name = item.name;
    emoji = item.emoji;
  } else if (item.type === 'empty' && item.name === 'Clown') {
    color = '#EF4444';
    stars = 1;
    rarityLabel = 'Clown';
  } else if (item.type === 'empty') {
    color = '#6B7280';
    rarityLabel = 'Empty';
  } else if (item.type === 'coins') {
    color = '#F59E0B';
    stars = 1;
    rarityLabel = 'Coins';
  } else if (item.type === 'environment') {
    color = '#10B981';
    stars = 2;
    rarityLabel = 'Environment';
  } else if (item.type === 'food') {
    color = item.category === 'drink' ? '#3B82F6' : '#F97316';
    stars = 1;
    rarityLabel = item.category === 'drink' ? 'Drink' : 'Food';
  } else if (item.type === 'toy') {
    color = '#8B5CF6';
    stars = 2;
    rarityLabel = 'Toy';
  } else if (item.type === 'decoration') {
    color = '#EC4899';
    stars = 2;
    rarityLabel = 'Decoration';
  }

  return (
    <div className="card-container" onClick={onClick}>
      <div className={`card-inner${revealed ? ' flipped' : ''}`}>
        <div className="card-face card-back">
          <div className="card-back-shine" />
          <div className="card-back-pattern">✦</div>
        </div>
        <div className="card-face card-front" data-rarity={item.type === 'animal' ? item.rarity : 'common'}>
          {isNew && item.type === 'animal' && <div className="card-new-badge">NEW</div>}
          {isNew && item.type !== 'animal' && <div className="card-new-badge" style={{ background: '#8B5CF6' }}>+1</div>}
          <div className="card-emoji">{emoji}</div>
          <div className="card-name">{name}</div>
          {stars > 0 && <div className="card-stars" style={{ color }}>{'★'.repeat(stars)}</div>}
          {rarityLabel && <div className="card-rarity" style={{ color }}>{rarityLabel}</div>}
          {item.type === 'coins' && <div className="card-rarity" style={{ color }}>+{item.amount}</div>}
          {item.type === 'animal' && item.sex && (
            <div className="card-sex-age">
              <span>{item.sex === 'male' ? '♂' : '♀'}</span>
              <span> {item.age}y / {item.lifespan}y</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
