const RARITIES = {
  common: { name: 'Common', color: '#9CA3AF', stars: 1, weight: 40 },
  uncommon: { name: 'Uncommon', color: '#10B981', stars: 2, weight: 30 },
  rare: { name: 'Rare', color: '#3B82F6', stars: 3, weight: 20 },
  epic: { name: 'Epic', color: '#8B5CF6', stars: 4, weight: 8 },
  legendary: { name: 'Legendary', color: '#F59E0B', stars: 5, weight: 2 },
};

const ANIMALS = [
  { id: 'lion', name: 'Lion', emoji: '🦁', rarity: 'rare' },
  { id: 'tiger', name: 'Tiger', emoji: '🐯', rarity: 'epic' },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', rarity: 'uncommon' },
  { id: 'giraffe', name: 'Giraffe', emoji: '🦒', rarity: 'uncommon' },
  { id: 'monkey', name: 'Monkey', emoji: '🐵', rarity: 'common' },
  { id: 'panda', name: 'Panda', emoji: '🐼', rarity: 'epic' },
  { id: 'fox', name: 'Fox', emoji: '🦊', rarity: 'rare' },
  { id: 'wolf', name: 'Wolf', emoji: '🐺', rarity: 'rare' },
  { id: 'eagle', name: 'Eagle', emoji: '🦅', rarity: 'epic' },
  { id: 'shark', name: 'Shark', emoji: '🦈', rarity: 'legendary' },
  { id: 'dolphin', name: 'Dolphin', emoji: '🐬', rarity: 'rare' },
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋', rarity: 'common' },
  { id: 'turtle', name: 'Turtle', emoji: '🐢', rarity: 'uncommon' },
  { id: 'peacock', name: 'Peacock', emoji: '🦚', rarity: 'rare' },
  { id: 'owl', name: 'Owl', emoji: '🦉', rarity: 'uncommon' },
  { id: 'dragon', name: 'Dragon', emoji: '🐉', rarity: 'legendary' },
  { id: 'phoenix', name: 'Phoenix', emoji: '🦩', rarity: 'legendary' },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐇', rarity: 'common' },
  { id: 'bear', name: 'Bear', emoji: '🐻', rarity: 'uncommon' },
  { id: 'penguin', name: 'Penguin', emoji: '🐧', rarity: 'common' },
  { id: 'dog', name: 'Dog', emoji: '🐕', rarity: 'common' },
  { id: 'cat', name: 'Cat', emoji: '🐈', rarity: 'common' },
  { id: 'horse', name: 'Horse', emoji: '🐴', rarity: 'uncommon' },
  { id: 'sheep', name: 'Sheep', emoji: '🐑', rarity: 'common' },
  { id: 'parrot', name: 'Parrot', emoji: '🦜', rarity: 'uncommon' },
];

const ENVIRONMENTS = [
  { id: 'savanna', name: 'Savanna', emoji: '🌾', description: 'Hot grasslands of Africa' },
  { id: 'house', name: 'House', emoji: '🏠', description: 'Cozy home environment' },
  { id: 'forest', name: 'Forest', emoji: '🌲', description: 'Temperate woodland' },
  { id: 'jungle', name: 'Jungle', emoji: '🌴', description: 'Dense tropical rainforest' },
  { id: 'farm', name: 'Farm', emoji: '🌽', description: 'Rural agricultural land' },
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
    { id: 'safari_car', name: 'Safari Car', emoji: '🚙' },
    { id: 'watering_hole', name: 'Watering Hole', emoji: '💦' },
    { id: 'acacia_tree', name: 'Acacia Tree', emoji: '🌳' },
  ],
  house: [
    { id: 'dog_bed', name: 'Dog Bed', emoji: '🛏️' },
    { id: 'cat_tree', name: 'Cat Tree', emoji: '🌴' },
    { id: 'fish_tank', name: 'Fish Tank', emoji: '🪸' },
  ],
  forest: [
    { id: 'mushroom_house', name: 'Mushroom House', emoji: '🍄' },
    { id: 'tree_stump', name: 'Tree Stump', emoji: '🪵' },
    { id: 'river_rock', name: 'River Rock', emoji: '🪨' },
  ],
  jungle: [
    { id: 'vine_swing', name: 'Vine Swing', emoji: '🪢' },
    { id: 'waterfall', name: 'Waterfall', emoji: '🌊' },
    { id: 'ancient_ruins', name: 'Ancient Ruins', emoji: '🏛️' },
  ],
  farm: [
    { id: 'hay_bale', name: 'Hay Bale', emoji: '🌾' },
    { id: 'tractor_tire', name: 'Tractor Tire', emoji: '⚙️' },
    { id: 'windmill', name: 'Windmill', emoji: '🌬️' },
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

const COMPATIBILITY = {
  savanna: ['lion', 'tiger', 'elephant', 'giraffe', 'fox', 'wolf'],
  house: ['dog', 'cat', 'rabbit', 'parrot'],
  forest: ['fox', 'wolf', 'owl', 'bear', 'butterfly', 'rabbit', 'panda', 'eagle', 'phoenix', 'parrot'],
  jungle: ['tiger', 'monkey', 'panda', 'butterfly', 'dragon', 'phoenix', 'parrot'],
  farm: ['horse', 'sheep', 'rabbit', 'bear', 'peacock', 'turtle', 'penguin'],
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
        const animal = pick(ANIMALS);
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
        const animalId = pick(ANIMALS).id;
        const toy = TOY_NAMES[animalId];
        item = { slot, type: 'toy', forAnimal: animalId, name: `${toy.name}`, emoji: toy.emoji };
        break;
      }
      case 'decoration': {
        const env = pick(ENVIRONMENTS);
        const dec = pick(ENV_DECORATIONS[env.id]);
        item = { slot, type: 'decoration', envType: env.id, name: dec.name, emoji: dec.emoji };
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
        const animal = pick(ANIMALS);
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
        const animalId = pick(ANIMALS).id;
        const toy = TOY_NAMES[animalId];
        item = { slot, type: 'toy', forAnimal: animalId, name: `${toy.name}`, emoji: toy.emoji };
        break;
      }
      case 'decoration': {
        const env = pick(ENVIRONMENTS);
        const dec = pick(ENV_DECORATIONS[env.id]);
        item = { slot, type: 'decoration', envType: env.id, name: dec.name, emoji: dec.emoji };
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
    const animalId = pick(ANIMALS).id;
    const toy = TOY_NAMES[animalId];
    pack.push({ slot, type: 'toy', forAnimal: animalId, name: toy.name, emoji: toy.emoji, uid: uid() });
  }
  return pack.sort(() => Math.random() - 0.5);
}

function generateAnimalPack() {
  const animal = pick(ANIMALS);
  return [{ slot: 0, type: 'animal', cardId: animal.id, name: animal.name, emoji: animal.emoji, rarity: animal.rarity, uid: uid() }];
}

function getCompatibleEnvironments(animalId) {
  return Object.entries(COMPATIBILITY)
    .filter(([, animals]) => animals.includes(animalId))
    .map(([env]) => env);
}

function getAnimalById(id) { return ANIMALS.find(a => a.id === id); }

export {
  RARITIES, ANIMALS, ENVIRONMENTS, FOOD_TYPES, ENV_DECORATIONS, TOY_NAMES,
  COMPATIBILITY, ITEM_WEIGHTS, generatePack, generateGigaPack, generateFoodPack, generateToyPack, generateAnimalPack,
  getCompatibleEnvironments, getAnimalById, uid,
};
