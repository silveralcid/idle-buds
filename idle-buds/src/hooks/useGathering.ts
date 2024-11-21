import { useGameStore } from '../stores/game.store';

export const useGathering = (resourceId: string, isUnlocked: boolean) => {
  const budActivity = useGameStore((state) => state.budActivity);
  const currentActivity = useGameStore((state) => state.currentActivity);

  const startGathering = (isBud: boolean) => {
    if (isUnlocked) {
      useGameStore.getState().startGathering(resourceId, isBud);
    }
  };

  const stopGathering = (isBud: boolean) => {
    if (isBud && budActivity === resourceId) {
      useGameStore.getState().stopBudGathering();
    } else if (!isBud && currentActivity === resourceId) {
      useGameStore.getState().stopHunterGathering();
    }
  };

  return { startGathering, stopGathering };
};