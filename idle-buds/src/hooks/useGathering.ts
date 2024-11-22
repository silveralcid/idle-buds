import { useGameStore } from '../stores/game.store';

export const useGathering = (nodeId: string, isUnlocked: boolean) => {
  const budActivity = useGameStore((state) => state.budActivity);
  const currentActivity = useGameStore((state) => state.currentActivity);

  const startGathering = (isBud: boolean) => {
    if (isUnlocked) {
      useGameStore.getState().startGathering(nodeId, isBud);
    }
  };

  const stopGathering = (isBud: boolean) => {
    if (isBud && budActivity === nodeId) {
      useGameStore.getState().stopBudGathering();
    } else if (!isBud && currentActivity === nodeId) {
      useGameStore.getState().stopHunterGathering();
    }
  };

  return { startGathering, stopGathering };
};