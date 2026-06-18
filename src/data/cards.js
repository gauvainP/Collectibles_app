const RARITIES = {
  common: { name: 'Common', color: '#9CA3AF', stars: 1, weight: 40 },
  uncommon: { name: 'Uncommon', color: '#10B981', stars: 2, weight: 30 },
  rare: { name: 'Rare', color: '#3B82F6', stars: 3, weight: 20 },
  epic: { name: 'Epic', color: '#8B5CF6', stars: 4, weight: 8 },
  legendary: { name: 'Legendary', color: '#F59E0B', stars: 5, weight: 2 },
};

const ANIMALS = [
  { id: 'lion', name: 'Lion', emoji: '🦁', rarity: 'rare', lifespan: 15 },
  { id: 'tiger', name: 'Tiger', emoji: '🐯', rarity: 'epic', lifespan: 15 },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', rarity: 'uncommon', lifespan: 60 },
  { id: 'giraffe', name: 'Giraffe', emoji: '🦒', rarity: 'uncommon', lifespan: 25 },
  { id: 'monkey', name: 'Monkey', emoji: '🐵', rarity: 'common', lifespan: 20 },
  { id: 'panda', name: 'Panda', emoji: '🐼', rarity: 'epic', lifespan: 20 },
  { id: 'fox', name: 'Fox', emoji: '🦊', rarity: 'rare', lifespan: 5 },
  { id: 'wolf', name: 'Wolf', emoji: '🐺', rarity: 'rare', lifespan: 10 },
  { id: 'eagle', name: 'Eagle', emoji: '🦅', rarity: 'epic', lifespan: 20 },
  { id: 'shark', name: 'Shark', emoji: '🦈', rarity: 'legendary', lifespan: 25 },
  { id: 'dolphin', name: 'Dolphin', emoji: '🐬', rarity: 'rare', lifespan: 30 },
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋', rarity: 'common', lifespan: 1 },
  { id: 'turtle', name: 'Turtle', emoji: '🐢', rarity: 'uncommon', lifespan: 80 },
  { id: 'peacock', name: 'Peacock', emoji: '🦚', rarity: 'rare', lifespan: 15 },
  { id: 'owl', name: 'Owl', emoji: '🦉', rarity: 'uncommon', lifespan: 15 },
  { id: 'dragon', name: 'Dragon', emoji: '🐉', rarity: 'legendary', lifespan: 1000 },
  { id: 'phoenix', name: 'Phoenix', emoji: '🦩', rarity: 'legendary', lifespan: 500 },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐇', rarity: 'common', lifespan: 8 },
  { id: 'bear', name: 'Bear', emoji: '🐻', rarity: 'uncommon', lifespan: 25 },
  { id: 'penguin', name: 'Penguin', emoji: '🐧', rarity: 'common', lifespan: 15 },
  { id: 'dog', name: 'Dog', emoji: '🐕', rarity: 'common', lifespan: 13 },
  { id: 'cat', name: 'Cat', emoji: '🐈', rarity: 'common', lifespan: 15 },
  { id: 'horse', name: 'Horse', emoji: '🐴', rarity: 'uncommon', lifespan: 25 },
  { id: 'sheep', name: 'Sheep', emoji: '🐑', rarity: 'common', lifespan: 12 },
  { id: 'parrot', name: 'Parrot', emoji: '🦜', rarity: 'uncommon', lifespan: 50 },
];

const ENVIRONMENTS = [
  { id: 'savanna', name: 'Savanna', emoji: '🌾', description: 'Hot grasslands of Africa' },
  { id: 'house', name: 'House', emoji: '🏠', description: 'Cozy home environment' },
  { id: 'forest', name: 'Forest', emoji: '🌲', description: 'Temperate woodland' },
  { id: 'jungle', name: 'Jungle', emoji: '🌴', description: 'Dense tropical rainforest' },
  { id: 'farm', name: 'Farm', emoji: '🌽', description: 'Rural agricultural land' },
  { id: 'aquatic', name: 'Aquarium', emoji: '🌊', description: 'Underwater aquatic habitat' },
];

const FOOD_TYPES = [
  { id: 'water', name: 'Water', emoji: '💧', category: 'drink' },
  { id: 'fruits', name: 'Fruits', emoji: '🍎', category: 'food' },
  { id: 'grass', name: 'Grass', emoji: '🌿', category: 'food' },
  { id: 'meat', name: 'Meat', emoji: '🥩', category: 'food' },
  { id: 'treat', name: 'Treat', emoji: '🍪', category: 'food' },
];

const ENV_DECORATIONS = {
  savanna: [
    { id: 'safari_car', name: 'Safari Car', emoji: '🚙', rarity: 'common' },
    { id: 'watering_hole', name: 'Watering Hole', emoji: '💦', rarity: 'uncommon' },
    { id: 'acacia_tree', name: 'Acacia Tree', emoji: '🌳', rarity: 'common' },
  ],
  house: [
    { id: 'dog_bed', name: 'Dog Bed', emoji: '🛏️', rarity: 'common' },
    { id: 'cat_tree', name: 'Cat Tree', emoji: '🌴', rarity: 'uncommon' },
    { id: 'fish_tank', name: 'Fish Tank', emoji: '🪸', rarity: 'rare' },
  ],
  forest: [
    { id: 'mushroom_house', name: 'Mushroom House', emoji: '🍄', rarity: 'uncommon' },
    { id: 'tree_stump', name: 'Tree Stump', emoji: '🪵', rarity: 'common' },
    { id: 'river_rock', name: 'River Rock', emoji: '🪨', rarity: 'common' },
  ],
  jungle: [
    { id: 'vine_swing', name: 'Vine Swing', emoji: '🪢', rarity: 'common' },
    { id: 'waterfall', name: 'Waterfall', emoji: '🌊', rarity: 'epic' },
    { id: 'ancient_ruins', name: 'Ancient Ruins', emoji: '🏛️', rarity: 'rare' },
  ],
  farm: [
    { id: 'hay_bale', name: 'Hay Bale', emoji: '🌾', rarity: 'common' },
    { id: 'tractor_tire', name: 'Tractor Tire', emoji: '⚙️', rarity: 'uncommon' },
    { id: 'windmill', name: 'Windmill', emoji: '🌬️', rarity: 'rare' },
  ],
  aquatic: [
    { id: 'coral_reef', name: 'Coral Reef', emoji: '🪸', rarity: 'uncommon' },
    { id: 'sunken_ship', name: 'Sunken Ship', emoji: '⛵', rarity: 'rare' },
    { id: 'treasure_chest', name: 'Treasure Chest', emoji: '🧳', rarity: 'epic' },
  ],
};

const TOY_NAMES = {
  lion: { name: 'Bone', emoji: '🦴' },
  tiger: { name: 'Bone', emoji: '🦴' },
  elephant: { name: 'Ball', emoji: '⚽' },
  giraffe: { name: 'Ball', emoji: '⚽' },
  monkey: { name: 'Banana Toy', emoji: '🍌' },
  panda: { name: 'Bamboo Stick', emoji: '🎋' },
  fox: { name: 'Feather Wand', emoji: '🪶' },
  wolf: { name: 'Bone', emoji: '🦴' },
  eagle: { name: 'Leather Perch', emoji: '🧶' },
  shark: { name: 'Rubber Fish', emoji: '🐟' },
  dolphin: { name: 'Hopping Ball', emoji: '🏀' },
  butterfly: { name: 'Flower Perch', emoji: '🌸' },
  turtle: { name: 'Basking Rock', emoji: '🪨' },
  peacock: { name: 'Mirror Toy', emoji: '🪞' },
  owl: { name: 'Leather Perch', emoji: '🧶' },
  dragon: { name: 'Gemstone', emoji: '💎' },
  phoenix: { name: 'Gemstone', emoji: '💎' },
  rabbit: { name: 'Carrot Chew', emoji: '🥕' },
  bear: { name: 'Honey Pot', emoji: '🍯' },
  penguin: { name: 'Ice Block', emoji: '🧊' },
  dog: { name: 'Chew Bone', emoji: '🦴' },
  cat: { name: 'Yarn Ball', emoji: '🧶' },
  horse: { name: 'Apple Ring', emoji: '🍎' },
  sheep: { name: 'Bell Collar', emoji: '🔔' },
  parrot: { name: 'Swing Perch', emoji: '🪢' },
};

const DIET_MAP = {
  meat: ['lion', 'tiger', 'fox', 'wolf', 'eagle', 'shark', 'dolphin', 'dragon', 'owl', 'phoenix', 'penguin'],
  grass: ['elephant', 'giraffe', 'monkey', 'panda', 'butterfly', 'turtle', 'rabbit', 'bear', 'horse', 'sheep', 'parrot'],
  fruits: ['monkey', 'bear', 'parrot', 'butterfly'],
  treat: ['cat', 'dog', 'rabbit', 'horse', 'sheep'],
};

const COMPATIBILITY = {
  savanna: ['lion', 'tiger', 'elephant', 'giraffe', 'fox', 'wolf'],
  house: ['dog', 'cat', 'rabbit', 'parrot'],
  forest: ['fox', 'wolf', 'owl', 'bear', 'butterfly', 'rabbit', 'panda', 'eagle', 'phoenix', 'parrot'],
  jungle: ['tiger', 'monkey', 'panda', 'butterfly', 'dragon', 'phoenix', 'parrot'],
  farm: ['horse', 'sheep', 'rabbit', 'bear', 'peacock', 'turtle', 'penguin'],
  aquatic: ['shark', 'dolphin', 'turtle', 'penguin'],
};

const ITEM_WEIGHTS = {
  animal: 10,
  environment: 5,
  food: 30,
  coins: 10,
  toy: 15,
  decoration: 10,
  empty: 20,
};

let _uid = Date.now();
function uid() { return `item_${_uid++}`; }

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
function pickWeightedAnimal() {
  const totalRarityWeight = RARITY_ORDER.reduce((s, r) => s + RARITIES[r].weight, 0);
  let roll = Math.random() * totalRarityWeight;
  let chosenRarity = 'common';
  for (const r of RARITY_ORDER) {
    roll -= RARITIES[r].weight;
    if (roll <= 0) { chosenRarity = r; break; }
  }
  const pool = ANIMALS.filter(a => a.rarity === chosenRarity);
  return pick(pool);
}

function pickWeightedDecoration(envId) {
  const pool = ENV_DECORATIONS[envId] || [];
  const totalRarityWeight = RARITY_ORDER.reduce((s, r) => s + RARITIES[r].weight, 0);
  let roll = Math.random() * totalRarityWeight;
  let chosenRarity = 'common';
  for (const r of RARITY_ORDER) {
    roll -= RARITIES[r].weight;
    if (roll <= 0) { chosenRarity = r; break; }
  }
  const filtered = pool.filter(d => d.rarity === chosenRarity);
  if (filtered.length === 0) return pick(pool);
  return pick(filtered);
}

function generatePack() {
  const pack = [];
  const types = Object.keys(ITEM_WEIGHTS);
  const totalW = Object.values(ITEM_WEIGHTS).reduce((a, b) => a + b, 0);

  for (let slot = 0; slot < 5; slot++) {
    let roll = Math.random() * totalW;
    let chosenType = 'empty';
    for (const t of types) {
      roll -= ITEM_WEIGHTS[t];
      if (roll <= 0) { chosenType = t; break; }
    }

    let item;
    switch (chosenType) {
      case 'animal': {
        const animal = pickWeightedAnimal();
        item = { slot, type: 'animal', cardId: animal.id, name: animal.name, emoji: animal.emoji, rarity: animal.rarity };
        break;
      }
      case 'environment': {
        const env = pick(ENVIRONMENTS);
        item = { slot, type: 'environment', envType: env.id, name: env.name, emoji: env.emoji };
        break;
      }
      case 'food': {
        const food = pick(FOOD_TYPES);
        item = { slot, type: 'food', foodType: food.id, name: food.name, emoji: food.emoji, category: food.category };
        break;
      }
      case 'coins':
        item = { slot, type: 'coins', amount: 20, name: '20 Coins', emoji: '🪙' };
        break;
      case 'toy': {
        const animalId = pickWeightedAnimal().id;
        const toy = TOY_NAMES[animalId];
        item = { slot, type: 'toy', forAnimal: animalId, name: `${toy.name}`, emoji: toy.emoji };
        break;
      }
      case 'decoration': {
        const env = pick(ENVIRONMENTS);
        const dec = pickWeightedDecoration(env.id);
        item = { slot, type: 'decoration', envType: env.id, name: dec.name, emoji: dec.emoji, rarity: dec.rarity };
        break;
      }
      default:
        item = { slot, type: 'empty', name: 'Empty Slot', emoji: '🃏' };
    }
    pack.push({ ...item, uid: uid() });
  }
  return pack.sort(() => Math.random() - 0.5);
}

function generateGigaPack() {
  const pack = [];
  const types = Object.keys(ITEM_WEIGHTS);
  const totalW = Object.values(ITEM_WEIGHTS).reduce((a, b) => a + b, 0);

  for (let slot = 0; slot < 30; slot++) {
    let roll = Math.random() * totalW;
    let chosenType = 'empty';
    for (const t of types) {
      roll -= ITEM_WEIGHTS[t];
      if (roll <= 0) { chosenType = t; break; }
    }

    let item;
    switch (chosenType) {
      case 'animal': {
        const animal = pickWeightedAnimal();
        item = { slot, type: 'animal', cardId: animal.id, name: animal.name, emoji: animal.emoji, rarity: animal.rarity };
        break;
      }
      case 'environment': {
        const env = pick(ENVIRONMENTS);
        item = { slot, type: 'environment', envType: env.id, name: env.name, emoji: env.emoji };
        break;
      }
      case 'food': {
        const food = pick(FOOD_TYPES);
        item = { slot, type: 'food', foodType: food.id, name: food.name, emoji: food.emoji, category: food.category };
        break;
      }
      case 'coins':
        item = { slot, type: 'coins', amount: 20, name: '20 Coins', emoji: '🪙' };
        break;
      case 'toy': {
        const animalId = pickWeightedAnimal().id;
        const toy = TOY_NAMES[animalId];
        item = { slot, type: 'toy', forAnimal: animalId, name: `${toy.name}`, emoji: toy.emoji };
        break;
      }
      case 'decoration': {
        const env = pick(ENVIRONMENTS);
        const dec = pickWeightedDecoration(env.id);
        item = { slot, type: 'decoration', envType: env.id, name: dec.name, emoji: dec.emoji, rarity: dec.rarity };
        break;
      }
      default:
        item = { slot, type: 'empty', name: 'Empty Slot', emoji: '🃏' };
    }
    pack.push({ ...item, uid: uid() });
  }
  return pack.sort(() => Math.random() - 0.5);
}

function generateFoodPack() {
  const pack = [];
  for (let slot = 0; slot < 5; slot++) {
    if (Math.random() < 0.2) {
      pack.push({ slot, type: 'empty', name: 'Clown', emoji: '🤡', uid: uid() });
    } else {
      const food = pick(FOOD_TYPES);
      pack.push({ slot, type: 'food', foodType: food.id, name: food.name, emoji: food.emoji, category: food.category, uid: uid() });
    }
  }
  return pack.sort(() => Math.random() - 0.5);
}

function generateToyPack() {
  const pack = [];
  for (let slot = 0; slot < 2; slot++) {
    const animal = pickWeightedAnimal();
    const toy = TOY_NAMES[animal.id];
    pack.push({ slot, type: 'toy', forAnimal: animal.id, name: toy.name, emoji: toy.emoji, uid: uid() });
  }
  return pack.sort(() => Math.random() - 0.5);
}

function generateAnimalPack() {
  const animal = pickWeightedAnimal();
  return [{ slot: 0, type: 'animal', cardId: animal.id, name: animal.name, emoji: animal.emoji, rarity: animal.rarity, uid: uid() }];
}

function generateEnvironmentPack() {
  const env = pick(ENVIRONMENTS);
  return [{ slot: 0, type: 'environment', envType: env.id, name: env.name, emoji: env.emoji, uid: uid() }];
}

function randomSex() {
  return Math.random() < 0.5 ? 'male' : 'female';
}

function getCompatibleEnvironments(animalId) {
  return Object.entries(COMPATIBILITY)
    .filter(([, animals]) => animals.includes(animalId))
    .map(([env]) => env);
}

function getAnimalById(id) { return ANIMALS.find(a => a.id === id); }

export {
  RARITIES, ANIMALS, ENVIRONMENTS, FOOD_TYPES, ENV_DECORATIONS, TOY_NAMES,
  COMPATIBILITY, DIET_MAP, ITEM_WEIGHTS, generatePack, generateGigaPack, generateFoodPack, generateToyPack, generateAnimalPack, generateEnvironmentPack,
  getCompatibleEnvironments, getAnimalById, uid, randomSex,
};
