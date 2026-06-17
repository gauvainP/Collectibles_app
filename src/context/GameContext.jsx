import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { generatePack, generateGigaPack, generateFoodPack, generateToyPack, generateAnimalPack, uid as genUid, getAnimalById, RARITIES } from '../data/cards';

const GameContext = createContext(null);
const STORAGE_KEY = 'collectibles_game';
const STARTING_COINS = 500;
const PACK_COST = 100;
const GIGA_PACK_COST = 500;
const FOOD_PACK_COST = 100;
const TOY_PACK_COST = 200;
const ANIMAL_PACK_COST = 300;

function today() { return new Date().toDateString(); }
const MAX_ENVIRONMENTS = 10;

function calculateVisitors(environments) {
  const alive = environments.filter(e => e.animal?.alive);
  if (alive.length === 0) return 0;
  const rareCount = alive.filter(e => {
    const r = getAnimalById(e.animal.cardId)?.rarity;
    return r === 'rare' || r === 'epic' || r === 'legendary';
  }).length;
  const totalHappiness = alive.reduce((sum, e) => {
    const a = e.animal;
    const starving = a.daysWithoutFood > 0 || a.daysWithoutDrink > 0;
    if (starving) return sum;
    return sum + [a.food, a.drink, a.toy, a.decoration].filter(Boolean).length * 25;
  }, 0);
  const avgH = alive.length > 0 ? totalHappiness / (alive.length * 100) : 0;
  return Math.floor((1 + 2 * alive.length + rareCount) * avgH);
}

function defaultState() {
  return {
    collection: [],
    claimedDate: null,
    packCards: null,
    revealedIds: [],
    coins: STARTING_COINS,
    inventory: [],
    zoo: { lastDailyDate: null, environments: [] },
    lastClaimDate: null,
    totalVisitors: 0,
    lastVisitors: 0,
  };
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultState(), ...parsed, zoo: { ...defaultState().zoo, ...(parsed.zoo || {}) } };
    }
  } catch {}
  return defaultState();
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function processDailyTick(state) {
  const last = state.zoo.lastDailyDate;
  if (last === today()) return state;

  const envs = state.zoo.environments.map(env => {
    if (!env.animal || !env.animal.alive) return env;
    const a = { ...env.animal };
    const hadFood = a.food !== null;
    const hadDrink = a.drink !== null;

    a.food = null;
    a.drink = null;
    a.daysWithoutFood = hadFood ? 0 : a.daysWithoutFood + 1;
    a.daysWithoutDrink = hadDrink ? 0 : a.daysWithoutDrink + 1;

    a.daysWithToy = a.toy ? (a.daysWithToy || 0) + 1 : 0;
    a.daysWithDecoration = a.decoration ? (a.daysWithDecoration || 0) + 1 : 0;

    if (a.daysWithToy >= 3) { a.toy = null; a.daysWithToy = 0; }
    if (a.daysWithDecoration >= 3) { a.decoration = null; a.daysWithDecoration = 0; }

    if (a.daysWithoutFood >= 2 && a.daysWithoutDrink >= 2) {
      a.alive = false;
    }

    return { ...env, animal: a };
  });

  return {
    ...state,
    zoo: { ...state.zoo, lastDailyDate: today(), environments: envs },
  };
}

function reducer(state, action) {
  let next = state;

  switch (action.type) {

    case 'CLAIM_PACK': {
      if (state.claimedDate === today()) return state;
      if (state.packCards) return state;
      const pack = generatePack();
      return { ...state, claimedDate: today(), packCards: pack, revealedIds: [] };
    }

    case 'REVEAL_CARD': {
      const itemUid = action.payload;
      if (state.revealedIds.includes(itemUid)) return state;
      const card = state.packCards?.find(c => c.uid === itemUid);
      if (!card) return state;

      const revealedIds = [...state.revealedIds, itemUid];
      let { collection, coins, inventory } = state;

      if (card.type === 'animal') {
        if (!collection.includes(card.cardId)) {
          collection = [...collection, card.cardId];
        }
        inventory = [...inventory, { uid: genUid(), type: 'animal', cardId: card.cardId }];
      } else if (card.type === 'environment') {
        inventory = [...inventory, { uid: genUid(), type: 'environment', envType: card.envType }];
      } else if (card.type === 'food') {
        inventory = [...inventory, { uid: genUid(), type: 'food', foodType: card.foodType, category: card.category }];
      } else if (card.type === 'coins') {
        coins += card.amount;
      } else if (card.type === 'toy') {
        inventory = [...inventory, { uid: genUid(), type: 'toy', forAnimal: card.forAnimal }];
      } else if (card.type === 'decoration') {
        inventory = [...inventory, { uid: genUid(), type: 'decoration', envType: card.envType }];
      }

      return { ...state, revealedIds, collection, coins, inventory };
    }

    case 'CLOSE_PACK':
      return { ...state, packCards: null, revealedIds: [] };

    case 'PLACE_ENVIRONMENT': {
      if (state.zoo.environments.length >= MAX_ENVIRONMENTS) return state;
      const envUid = action.payload;
      const idx = state.inventory.findIndex(i => i.uid === envUid && i.type === 'environment');
      if (idx === -1) return state;

      const envType = state.inventory[idx].envType;
      const inventory = state.inventory.filter((_, i) => i !== idx);
      const env = { id: genUid(), envType, decoration: null, animal: null };

      return { ...state, inventory, zoo: { ...state.zoo, environments: [...state.zoo.environments, env] } };
    }

    case 'PLACE_ANIMAL': {
      const { envId, invUid } = action.payload;
      const invIdx = state.inventory.findIndex(i => i.uid === invUid && i.type === 'animal');
      if (invIdx === -1) return state;

      const envIdx = state.zoo.environments.findIndex(e => e.id === envId);
      if (envIdx === -1) return state;
      if (state.zoo.environments[envIdx].animal) return state;

      const animal = state.inventory[invIdx];
      const animalDef = getAnimalById(animal.cardId);
      if (!animalDef) return state;

      const env = state.zoo.environments[envIdx];
      const compat = {
        savanna: ['lion','tiger','elephant','giraffe','fox','wolf'],
        house: ['dog','cat','rabbit','parrot'],
        forest: ['fox','wolf','owl','bear','butterfly','rabbit','panda','eagle','phoenix','parrot'],
        jungle: ['tiger','monkey','panda','butterfly','dragon','phoenix','parrot'],
        farm: ['horse','sheep','rabbit','bear','peacock','turtle','penguin'],
      };
      if (!compat[env.envType]?.includes(animal.cardId)) return state;

      const inventory = state.inventory.filter((_, i) => i !== invIdx);
      const environments = state.zoo.environments.map((e, i) =>
        i === envIdx
          ? { ...e, animal: { cardId: animal.cardId, alive: true, food: null, drink: null, toy: null, decoration: null, daysWithoutFood: 0, daysWithoutDrink: 0, daysWithToy: 0, daysWithDecoration: 0 } }
          : e
      );

      return { ...state, inventory, zoo: { ...state.zoo, environments } };
    }

    case 'EQUIP_ITEM': {
      const { envId, invUid, slot } = action.payload;
      const invIdx = state.inventory.findIndex(i => i.uid === invUid);
      if (invIdx === -1) return state;
      const item = state.inventory[invIdx];

      const envIdx = state.zoo.environments.findIndex(e => e.id === envId);
      if (envIdx === -1) return state;
      const env = state.zoo.environments[envIdx];
      if (!env.animal || !env.animal.alive) return state;

      const animalId = env.animal.cardId;
      let valid = false;

      if (slot === 'food') valid = item.type === 'food' && item.category === 'food';
      else if (slot === 'drink') valid = item.type === 'food' && item.foodType === 'water';
      else if (slot === 'toy') valid = item.type === 'toy' && item.forAnimal === animalId;
      else if (slot === 'decoration') valid = item.type === 'decoration' && item.envType === env.envType;

      if (!valid) return state;
      if (env.animal[slot] !== null) return state;

      const inventory = state.inventory.filter((_, i) => i !== invIdx);
      const environments = state.zoo.environments.map((e, i) => {
        if (i !== envIdx) return e;
        const extra = {};
        if (slot === 'toy') extra.daysWithToy = 0;
        if (slot === 'decoration') extra.daysWithDecoration = 0;
        return { ...e, animal: { ...e.animal, [slot]: invUid, ...extra } };
      });

      return { ...state, inventory, zoo: { ...state.zoo, environments } };
    }

    case 'BUY_PACK': {
      if (state.coins < PACK_COST) return state;
      if (state.packCards) return state;
      const pack = generatePack();
      return { ...state, packCards: pack, revealedIds: [], coins: state.coins - PACK_COST };
    }

    case 'BUY_GIGA_PACK': {
      if (state.coins < GIGA_PACK_COST) return state;
      if (state.packCards) return state;
      const pack = generateGigaPack();
      return { ...state, packCards: pack, revealedIds: [], coins: state.coins - GIGA_PACK_COST };
    }

    case 'BUY_FOOD_PACK': {
      if (state.coins < FOOD_PACK_COST) return state;
      if (state.packCards) return state;
      const pack = generateFoodPack();
      return { ...state, packCards: pack, revealedIds: [], coins: state.coins - FOOD_PACK_COST };
    }

    case 'BUY_TOY_PACK': {
      if (state.coins < TOY_PACK_COST) return state;
      if (state.packCards) return state;
      const pack = generateToyPack();
      return { ...state, packCards: pack, revealedIds: [], coins: state.coins - TOY_PACK_COST };
    }

    case 'BUY_ANIMAL_PACK': {
      if (state.coins < ANIMAL_PACK_COST) return state;
      if (state.packCards) return state;
      const pack = generateAnimalPack();
      return { ...state, packCards: pack, revealedIds: [], coins: state.coins - ANIMAL_PACK_COST };
    }

    case 'REVEAL_ALL': {
      const unrevealed = state.packCards?.filter(c => !state.revealedIds.includes(c.uid)) || [];
      if (unrevealed.length === 0) return state;
      let { collection, coins, inventory } = state;
      const revealedIds = [...state.revealedIds];
      for (const card of unrevealed) {
        revealedIds.push(card.uid);
        if (card.type === 'animal') {
          if (!collection.includes(card.cardId)) {
            collection = [...collection, card.cardId];
          }
          inventory = [...inventory, { uid: genUid(), type: 'animal', cardId: card.cardId }];
        } else if (card.type === 'environment') {
          inventory = [...inventory, { uid: genUid(), type: 'environment', envType: card.envType }];
        } else if (card.type === 'food') {
          inventory = [...inventory, { uid: genUid(), type: 'food', foodType: card.foodType, category: card.category }];
        } else if (card.type === 'coins') {
          coins += card.amount;
        } else if (card.type === 'toy') {
          inventory = [...inventory, { uid: genUid(), type: 'toy', forAnimal: card.forAnimal }];
        } else if (card.type === 'decoration') {
          inventory = [...inventory, { uid: genUid(), type: 'decoration', envType: card.envType }];
        }
      }
      return { ...state, revealedIds, collection, coins, inventory };
    }

    case 'CLAIM_ZOO_MONEY': {
      if (state.lastClaimDate === today()) return state;
      const visitors = calculateVisitors(state.zoo.environments);
      if (visitors === 0) return state;
      return {
        ...state,
        coins: state.coins + visitors,
        lastClaimDate: today(),
        totalVisitors: (state.totalVisitors || 0) + visitors,
        lastVisitors: visitors,
      };
    }

    case 'SELL_ITEM': {
      const { itemType, filter } = action.payload;
      const idx = state.inventory.findIndex(i => {
        if (i.type !== itemType) return false;
        return Object.entries(filter).every(([k, v]) => i[k] === v);
      });
      if (idx === -1) return state;
      let coins = 0;
      if (itemType === 'food') coins = 2;
      else if (itemType === 'toy') coins = 3;
      else if (itemType === 'environment') coins = 10;
      else if (itemType === 'animal') {
        const animal = getAnimalById(filter.cardId);
        const mult = animal ? (RARITIES[animal.rarity]?.stars || 1) : 1;
        coins = 5 * mult;
      }
      const inventory = state.inventory.filter((_, i) => i !== idx);
      return { ...state, inventory, coins: state.coins + coins };
    }

    case 'CLEAR_ENVIRONMENT': {
      const clearId = action.payload;
      const environments = state.zoo.environments.filter(e => e.id !== clearId);
      return { ...state, zoo: { ...state.zoo, environments } };
    }

    case 'TICK': {
      return processDailyTick(state);
    }

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);

  useEffect(() => { saveState(state); }, [state]);

  useEffect(() => {
    const interval = setInterval(() => dispatch({ type: 'TICK' }), 60000);
    dispatch({ type: 'TICK' });
    return () => clearInterval(interval);
  }, []);

  const canClaim = state.claimedDate !== today();
  const hasPack = state.packCards !== null && state.packCards.length > 0;
  const allRevealed = hasPack && state.revealedIds.length === state.packCards.length;
  const canDoDailyAction = true;
  const aliveAnimals = state.zoo.environments.filter(e => e.animal?.alive).length;
  const deadAnimals = state.zoo.environments.filter(e => e.animal && !e.animal.alive).length;

  const claimPack = useCallback(() => dispatch({ type: 'CLAIM_PACK' }), []);
  const buyPack = useCallback(() => dispatch({ type: 'BUY_PACK' }), []);
  const buyGigaPack = useCallback(() => dispatch({ type: 'BUY_GIGA_PACK' }), []);
  const buyFoodPack = useCallback(() => dispatch({ type: 'BUY_FOOD_PACK' }), []);
  const buyToyPack = useCallback(() => dispatch({ type: 'BUY_TOY_PACK' }), []);
  const buyAnimalPack = useCallback(() => dispatch({ type: 'BUY_ANIMAL_PACK' }), []);
  const revealCard = useCallback((uid) => dispatch({ type: 'REVEAL_CARD', payload: uid }), []);
  const revealAll = useCallback(() => dispatch({ type: 'REVEAL_ALL' }), []);
  const closePack = useCallback(() => dispatch({ type: 'CLOSE_PACK' }), []);
  const placeEnvironment = useCallback((uid) => dispatch({ type: 'PLACE_ENVIRONMENT', payload: uid }), []);
  const placeAnimal = useCallback((envId, invUid) => dispatch({ type: 'PLACE_ANIMAL', payload: { envId, invUid } }), []);
  const equipItem = useCallback((envId, invUid, slot) => dispatch({ type: 'EQUIP_ITEM', payload: { envId, invUid, slot } }), []);
  const clearEnvironment = useCallback((envId) => dispatch({ type: 'CLEAR_ENVIRONMENT', payload: envId }), []);
  const claimZooMoney = useCallback(() => dispatch({ type: 'CLAIM_ZOO_MONEY' }), []);
  const sellItem = useCallback((itemType, filter) => dispatch({ type: 'SELL_ITEM', payload: { itemType, filter } }), []);

  const visitors = calculateVisitors(state.zoo.environments);
  const canClaimZooMoney = state.lastClaimDate !== today();
  const envCount = state.zoo.environments.length;

  return (
    <GameContext.Provider value={{
      collection: state.collection,
      canClaim,
      hasPack,
      allRevealed,
      packCards: state.packCards || [],
      revealedIds: state.revealedIds,
      coins: state.coins,
      inventory: state.inventory,
      zoo: state.zoo,
      canDoDailyAction,
      aliveAnimals,
      deadAnimals,
      packCost: PACK_COST, gigaPackCost: GIGA_PACK_COST,
      foodPackCost: FOOD_PACK_COST, toyPackCost: TOY_PACK_COST, animalPackCost: ANIMAL_PACK_COST,
      visitors, canClaimZooMoney, envCount, maxEnvironments: MAX_ENVIRONMENTS,
      totalVisitors: state.totalVisitors || 0, lastVisitors: state.lastVisitors || 0,
      claimPack, buyPack, buyGigaPack, buyFoodPack, buyToyPack, buyAnimalPack, revealCard, revealAll, closePack,
      placeEnvironment, placeAnimal, equipItem, clearEnvironment, claimZooMoney, sellItem,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
