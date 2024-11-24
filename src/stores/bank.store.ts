import { create } from "zustand";
import { GameEvents } from "../core/game-events/game-events";

interface BankState {
  items: Record<string, number>; // Tracks items by ID and their quantities
  addItem: (itemId: string, amount: number) => void; // Add items to the bank
  resetBank: () => void; // Reset all items in the bank
  removeItem: (itemId: string, amount: number) => void; // Remove items from the bank
  loadState: (state: Record<string, number>) => void; // Load items into the bank
}

const gameEvents = GameEvents.getInstance();

export const useBankStore = create<BankState>((set) => {
  // Listen for resourceGathered event
  gameEvents.on("resourceGathered", ({ name, quantity }) => {
    set((state) => ({
      items: {
        ...state.items,
        [name]: (state.items[name] || 0) + quantity,
      },
    }));
  });

  return {
    items: {},

    addItem: (itemId, amount) =>
      set((state) => ({
        items: {
          ...state.items,
          [itemId]: (state.items[itemId] || 0) + amount,
        },
      })),

    resetBank: () => set({ items: {} }),

    removeItem: (itemId, amount) =>
      set((state) => {
        const currentAmount = state.items[itemId] || 0;
        if (currentAmount < amount) {
          console.error(`Not enough of item ${itemId} to remove.`);
          return state;
        }

        return {
          items: {
            ...state.items,
            [itemId]: currentAmount - amount,
          },
        };
      }),

      loadState: (loadedState) => {
        // Log the loadedState to inspect its structure
        console.log("Loading Bank State:", loadedState);
      
        // Validate the structure of `items`
        if (
          loadedState &&
          typeof loadedState.items === "object" &&
          loadedState.items !== null &&
          Object.values(loadedState.items).every((value) => typeof value === "number")
        ) {
          // Valid items structure
          set({ items: loadedState.items });
          console.log("Bank state loaded successfully:", loadedState.items);
        } else {
          // Invalid structure
          console.error("Invalid item structure in bank state.", loadedState);
          set({ items: {} }); // Default to an empty bank
        }
      },
      
  };
});
