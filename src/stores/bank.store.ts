import { create } from 'zustand';

interface BankState {
  items: Record<string, number>;
  resetBank: () => void;
  addItem: (itemId: string, amount: number) => void;
  removeItem: (itemId: string, amount: number) => void;
}

export const useBankStore = create<BankState>((set) => ({
  items: {},
  resetBank: () => set({ items: {} }),
  addItem: (itemId, amount) => set((state) => ({
    items: {
      ...state.items,
      [itemId]: (state.items[itemId] || 0) + amount,
    },
  })),
  removeItem: (itemId, amount) => set((state) => {
    const currentAmount = state.items[itemId] || 0;
    if (currentAmount < amount) return state;
    
    return {
      items: {
        ...state.items,
        [itemId]: currentAmount - amount
      }
    };
  }),
}));