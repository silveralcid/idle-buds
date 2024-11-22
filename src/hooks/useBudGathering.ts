// src/hooks/useBudGathering.ts
import { useActivityStore } from '../stores/activity.store';
import { moveBudToNode, moveBudFromNodeToParty } from '../utils/bud-management.utils';

export const useBudGathering = (nodeId: string, isUnlocked: boolean) => {
  const budActivities = useActivityStore((state) => state.budActivities);

  const startGathering = (budId: string) => {
    if (!isUnlocked || !budId) return;
    moveBudToNode(budId, nodeId);
  };

  const stopGathering = (budId: string) => {
    if (budActivities[budId]?.nodeId === nodeId) {
      moveBudFromNodeToParty(budId, nodeId);
    }
  };

  const isGathering = (budId: string) => 
    budActivities[budId]?.nodeId === nodeId;

  return { startGathering, stopGathering, isGathering };
};