// src/stores/bank.store.ts
import { create } from 'zustand';
import { 
  ItemType, 
  EquipmentType, 
  WeaponType,
  ToolType,
  MaterialType,
  ConsumableType,
  EquipmentQuality,
  EquipmentSlot 
} from '../enums/item.enums';
import { ResourceType } from '../enums/resource.enums';
import { ProgressionTier } from '../enums/game.enums';

// Base Bank Item
interface BankItem {
  id: string;
  name: string;
  itemType: ItemType;
  quantity: number;
  tier: ProgressionTier;
}

// Equipment
interface BankedEquipment extends BankItem {
  itemType: ItemType.EQUIPMENT;
  equipmentType: EquipmentType;
  quality: EquipmentQuality;
  stats: {
    health?: number;
    wisdom?: number;
    attack?: number;
    defense?: number;
    dexterity?: number;
  };
  durability: number;
  maxDurability: number;
  requirements: {
    level: number;
    stats?: Partial<Record<keyof BankedEquipment['stats'], number>>;
  };
}

// Resources
export interface BankedResource extends BankItem {
  itemType: ItemType.RESOURCE;
  resourceType: ResourceType;
}

// Materials
interface BankedMaterial extends BankItem {
  itemType: ItemType.MATERIAL;
  materialType: MaterialType;
}

// Consumables
interface BankedConsumable extends BankItem {
  itemType: ItemType.CONSUMABLE;
  consumableType: ConsumableType;
  effect: {
    type: string;
    value: number;
    duration?: number;
  };
}

interface BankStore {
  items: Record<string, BankItem>;
  _accumulatedFractions: Record<string, number>;  // Track fractional resources
  
  // Bank methods
  depositItem: (item: BankItem) => void;
  withdrawItem: (itemId: string, amount: number) => boolean;
  getItemQuantity: (itemId: string) => number;
  hasItem: (itemId: string, amount: number) => boolean;
  
  // Bank info
  getTotalItems: () => number;
  getItemsByType: (itemType: ItemType) => BankItem[];
  searchItems: (query: string) => BankItem[];
}

export const useBankStore = create<BankStore>((set, get) => ({
  items: {},
  _accumulatedFractions: {},

  depositItem: (item) => 
    set((state) => {
      const currentFraction = state._accumulatedFractions[item.id] || 0;
      const newFraction = currentFraction + (item.quantity % 1);
      const wholeNumber = Math.floor(item.quantity);
      let additionalWhole = 0;

      // If accumulated fractions exceed 1, add to whole number
      const newState = {
        items: {
          ...state.items,
          [item.id]: {
            ...item,
            quantity: (state.items[item.id]?.quantity || 0) + wholeNumber + additionalWhole
          }
        },
        _accumulatedFractions: {
          ...state._accumulatedFractions,
          [item.id]: newFraction % 1
        }
      };

      console.log('Bank updated:', newState); // Debug log
      return newState;
    }),

  withdrawItem: (itemId, amount) => {
    const state = get();
    const currentQuantity = state.items[itemId]?.quantity || 0;
    
    if (currentQuantity < amount) return false;

    set((state) => ({
      items: {
        ...state.items,
        [itemId]: {
          ...state.items[itemId],
          quantity: currentQuantity - amount
        }
      }
    }));
    return true;
  },

  getItemQuantity: (itemId) => {
    const state = get();
    const wholeNumber = state.items[itemId]?.quantity || 0;
    const fraction = state._accumulatedFractions[itemId] || 0;
    return wholeNumber + fraction;
  },

  hasItem: (itemId, amount) => 
    get().getItemQuantity(itemId) >= amount,

  getTotalItems: () => 
    Object.values(get().items).reduce((total, item) => total + item.quantity, 0),

  getItemsByType: (itemType) => 
    Object.values(get().items).filter(item => item.itemType === itemType),

  searchItems: (query) => 
    Object.values(get().items).filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    )
}));