import { create } from 'zustand';

interface BankState {
    items: Record<string, number>; // Mapping of item IDs to their quantities
    filters: string[];             // Active filters (e.g., by category or rarity)
    sorting: 'name' | 'quantity' | 'value'; // Sorting preference
    totalValue: number;            // Sum of all item values in the bank
    addItem: (itemId: string, quantity: number) => void;  // Add items to the bank
    removeItem: (itemId: string, quantity: number) => void; // Remove items from the bank
    applyFilter: (filter: string) => void; // Add a filter
    clearFilters: () => void;      // Clear all active filters
    setSorting: (sorting: 'name' | 'quantity' | 'value') => void; // Set sorting preference
  }
  

export const useBankStore = create<BankState>((set) => ({
  items: {}, // Start with an empty bank
  filters: [],
  sorting: 'name',
  totalValue: 0,

  addItem: (itemId, quantity) =>
    set((state) => {
      const newItems = { ...state.items };
      newItems[itemId] = (newItems[itemId] || 0) + quantity;
      return { items: newItems };
    }),

  removeItem: (itemId, quantity) =>
    set((state) => {
      const newItems = { ...state.items };
      if (newItems[itemId]) {
        newItems[itemId] = Math.max(0, newItems[itemId] - quantity);
        if (newItems[itemId] === 0) {
          delete newItems[itemId];
        }
      }
      return { items: newItems };
    }),

  applyFilter: (filter) =>
    set((state) => ({
      filters: [...state.filters, filter],
    })),

  clearFilters: () =>
    set(() => ({
      filters: [],
    })),

  setSorting: (sorting) =>
    set(() => ({ sorting })),
}));
