import { create } from 'zustand';
import { equipmentItem } from '../../types/equipment.types';
import { ConsumableItem } from '../../types/consumable.types';
import { SlotType } from '../../enums/equipmentSlotType.enums';
import { useCombatStore } from '../combat/combat.store';
import { useBankStore } from '../bank/bank.store';

interface EquippedConsumable extends ConsumableItem {
  quantity: number;
}

interface EquipmentState {
  equipped: Partial<Record<SlotType, equipmentItem | EquippedConsumable>>;
  
  // Actions
  equipItem: (item: equipmentItem | ConsumableItem, quantity?: number) => boolean;
  unequipItem: (slot: SlotType, quantity?: number) => boolean;
  canEquipItem: (item: equipmentItem | ConsumableItem) => boolean;
  getEquippedItem: (slot: SlotType) => equipmentItem | EquippedConsumable | null;
  
  // Stats
  getTotalStats: () => {
    attack: number;
    defense: number;
    health: number;
    intelligence: number;
    dexterity: number;
  };
}

export const useEquipmentStore = create<EquipmentState>((set, get) => ({
  equipped: {},

  equipItem: (item: equipmentItem | ConsumableItem, quantity: number = 1): boolean => {
    const bankStore = useBankStore.getState();
    const availableQuantity = bankStore.items[item.id] || 0;

    // Special handling for consumables and food
    if (item.type === 'consumable' || item.type === 'food') {
      if (availableQuantity < quantity) return false;

      // Remove from bank
      bankStore.removeItem(item.id, quantity);

      // Get currently equipped consumable or food
      const currentEquipped = get().equipped['food'] as EquippedConsumable | undefined;

      if (currentEquipped) {
        if (currentEquipped.id === item.id) {
          // Stack with existing item
          set(state => ({
            equipped: {
              ...state.equipped,
              food: {
                ...currentEquipped,
                quantity: currentEquipped.quantity + quantity
              }
            }
          }));
        } else {
          // Return current item to bank and equip new stack
          bankStore.addItem(currentEquipped.id, currentEquipped.quantity);
          set(state => ({
            equipped: {
              ...state.equipped,
              food: {
                ...item,
                quantity
              }
            }
          }));
        }
      } else {
        // Equip new stack
        set(state => ({
          equipped: {
            ...state.equipped,
            food: {
              ...item,
              quantity
            }
          }
        }));
      }

      return true;
    }

    // Regular equipment handling (unchanged)
    if (!get().canEquipItem(item)) {
      return false;
    }

    bankStore.removeItem(item.id, 1);
    const currentEquipped = get().equipped[item.slot];
    if (currentEquipped) {
      bankStore.addItem(currentEquipped.id, 1);
    }

    set(state => ({
      equipped: {
        ...state.equipped,
        [item.slot]: { ...item, isEquipped: true }
      }
    }));

    return true;
  },

  unequipItem: (slot: SlotType, quantity?: number): boolean => {
    const currentEquipped = get().equipped[slot];
    if (!currentEquipped) return false;

    const bankStore = useBankStore.getState();

    // Handle consumable unequipping
    if (currentEquipped.type === 'consumable') {
      const equippedConsumable = currentEquipped as EquippedConsumable;
      const unequipAmount = quantity || equippedConsumable.quantity;

      if (unequipAmount > equippedConsumable.quantity) return false;

      bankStore.addItem(equippedConsumable.id, unequipAmount);

      if (unequipAmount === equippedConsumable.quantity) {
        // Remove slot entirely if all items unequipped
        set(state => {
          const newEquipped = { ...state.equipped };
          delete newEquipped[slot];
          return { equipped: newEquipped };
        });
      } else {
        // Update quantity if partially unequipped
        set(state => ({
          equipped: {
            ...state.equipped,
            [slot]: {
              ...equippedConsumable,
              quantity: equippedConsumable.quantity - unequipAmount
            }
          }
        }));
      }
      return true;
    }

    // Regular equipment unequipping (unchanged)
    bankStore.addItem(currentEquipped.id, 1);
    set(state => {
      const newEquipped = { ...state.equipped };
      delete newEquipped[slot];
      return { equipped: newEquipped };
    });

    return true;
  },

  // Rest of the implementation remains unchanged
  canEquipItem: (item: equipmentItem | ConsumableItem): boolean => {
    // Consumables don't have requirements
    if (item.type === 'consumable') return true;

    // At this point we know it's an equipment item
    const equipItem = item as equipmentItem;
    const combatStore = useCombatStore.getState();
    const { stats, level } = combatStore;

    if (equipItem.requirements) {
      if (level < equipItem.requirements.level) return false;
      
      if (equipItem.requirements.attributes) {
        for (const [stat, required] of Object.entries(equipItem.requirements.attributes)) {
          if (stats[stat as keyof typeof stats] < required) return false;
        }
      }
    }

    return true;
  },

  getEquippedItem: (slot: SlotType): equipmentItem | EquippedConsumable | null => {
    return get().equipped[slot] || null;
  },

  getTotalStats: () => {
    const stats = {
      attack: 0,
      defense: 0,
      health: 0,
      intelligence: 0,
      dexterity: 0
    };

    Object.values(get().equipped).forEach(item => {
      // Only equipment items have stats
      if (item?.type === 'equipment' && item.stats) {
        Object.entries(item.stats).forEach(([stat, value]) => {
          stats[stat as keyof typeof stats] += value;
        });
      }
    });

    return stats;
  }
}));
