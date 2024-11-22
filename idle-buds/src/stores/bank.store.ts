import { create } from 'zustand';

interface BankState {
  items: Record<string, number>;
  addItem: (itemId: string, amount: number) => void;
  resetBank: () => void;
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
}));