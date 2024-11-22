// src/hooks/useHunterGathering.ts
import { useActivityStore } from '../stores/activity.store';

export const useHunterGathering = (nodeId: string, isUnlocked: boolean) => {
  const hunterActivity = useActivityStore((state) => state.hunterActivity);

  const startGathering = () => {
    if (!isUnlocked) return;
    
    useActivityStore.getState().startActivity('hunter', {
      type: 'gathering',
      nodeId
    });
  };

  const stopGathering = () => {
    if (hunterActivity?.nodeId === nodeId) {
      useActivityStore.getState().stopActivity('hunter');
    }
  };

  const isGathering = hunterActivity?.nodeId === nodeId;

  return { startGathering, stopGathering, isGathering };
};