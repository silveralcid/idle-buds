import { create } from 'zustand';
import { equipmentItem } from '../../types/equipment.types';
import { SlotType } from '../../enums/equipmentSlotType.enums';
import { useCombatStore } from '../combat/combat.store';
import { useBankStore } from '../bank/bank.store';

interface EquipmentState {
  equipped: Partial<Record<SlotType, equipmentItem>>;
  
  // Actions
  equipItem: (item: equipmentItem) => boolean;
  unequipItem: (slot: SlotType) => boolean;
  canEquipItem: (item: equipmentItem) => boolean;
  getEquippedItem: (slot: SlotType) => equipmentItem | null;
  
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

  equipItem: (item: equipmentItem): boolean => {
    const combatStore = useCombatStore.getState();
    const bankStore = useBankStore.getState();

    // Check requirements
    if (!get().canEquipItem(item)) {
      return false;
    }

    // Remove from bank
    bankStore.removeItem(item.id, 1);

    // If something is equipped in that slot, unequip it first
    const currentEquipped = get().equipped[item.slot];
    if (currentEquipped) {
      bankStore.addItem(currentEquipped.id, 1);
    }

    // Equip new item
    set(state => ({
      equipped: {
        ...state.equipped,
        [item.slot]: { ...item, isEquipped: true }
      }
    }));

    return true;
  },

  unequipItem: (slot: SlotType): boolean => {
    const currentEquipped = get().equipped[slot];
    if (!currentEquipped) return false;

    const bankStore = useBankStore.getState();
    bankStore.addItem(currentEquipped.id, 1);

    set(state => {
      const newEquipped = { ...state.equipped };
      delete newEquipped[slot];
      return { equipped: newEquipped };
    });

    return true;
  },

  canEquipItem: (item: equipmentItem): boolean => {
    const combatStore = useCombatStore.getState();
    const { stats, level } = combatStore;

    if (item.requirements) {
      if (level < item.requirements.level) return false;
      
      if (item.requirements.attributes) {
        for (const [stat, required] of Object.entries(item.requirements.attributes)) {
          if (stats[stat as keyof typeof stats] < required) return false;
        }
      }
    }

    return true;
  },

  getEquippedItem: (slot: SlotType): equipmentItem | null => {
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
      if (item?.stats) {
        Object.entries(item.stats).forEach(([stat, value]) => {
          stats[stat as keyof typeof stats] += value;
        });
      }
    });

    return stats;
  }
}));
