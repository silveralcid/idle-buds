import { create } from 'zustand';

interface BankState {
  items: Record<string, number>;
  addItem: (itemId: string, amount: number) => void;
  resetBank: () => void;
  removeItem: (itemId: string, amount: number) => void;
}

export const useBankStore = create<BankState>((set) => ({
  items: {},
  addItem: (itemId, amount) => set((state) => ({
    items: {
      ...state.items,
      [itemId]: (state.items[itemId] || 0) + amount,
    },
  })),
  resetBank: () => set({ items: {} }),
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