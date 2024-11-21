import { useBankStore } from "../stores/bank.store";
import { useGameStore } from "../stores/game.store";
import { useHunterStore } from "../stores/hunter.store";
import { GameState } from "../types/state.types";

export function saveGameState(state: GameState) {
    const gameState = useGameStore.getState();
    const bankState = useBankStore.getState();
    const hunterState = useHunterStore.getState();
  
    const combinedState = {
      game: gameState,
      bank: bankState,
      hunter: hunterState,
    };
  
    localStorage.setItem('gameState', JSON.stringify(combinedState));
};
  
export const loadGameState = () => {
    // Retrieve the saved state from local storage or another source
    const savedState = localStorage.getItem('gameState');
    return savedState ? JSON.parse(savedState) : {};
  };
  
export const resetGameState = () => ({
    resources: {},
    fractionalResources: {},
    fractionalXP: {},
    isGathering: false,
    currentActivity: null,
    budActivity: null,
  });