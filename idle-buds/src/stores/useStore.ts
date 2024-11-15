import { create } from 'zustand'

// Define your store's type
interface GameState {
  // Example state properties
  level: number
  experience: number
  // Example actions
  increaseLevel: () => void
  addExperience: (amount: number) => void
}

// Create the store
export const useGameStore = create<GameState>((set) => ({
  // Initial state
  level: 1,
  experience: 0,

  // Actions
  increaseLevel: () => set((state) => ({ level: state.level + 1 })),
  addExperience: (amount) => set((state) => ({ experience: state.experience + amount })),
}))
