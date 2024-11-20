import { create } from 'zustand';

interface BankState {
  resources: Record<string, number>;
  addResource: (resourceId: string, amount: number) => void;
}

export const useBankStore = create<BankState>((set) => ({
  resources: {},
  addResource: (resourceId, amount) => set((state) => ({
    resources: {
      ...state.resources,
      [resourceId]: (state.resources[resourceId] || 0) + amount,
    },
  })),
}));