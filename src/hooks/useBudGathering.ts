// src/hooks/useBudGathering.ts
import { useActivityStore } from '../stores/activity.store';
import { moveBudToNode, moveBudFromNodeToParty } from '../utils/bud-management.utils';

export const useBudGathering = (nodeId: string, isUnlocked: boolean) => {
  const budActivities = useActivityStore((state) => state.budActivities);
  const startActivity = useActivityStore((state) => state.startActivity);
  const stopActivity = useActivityStore((state) => state.stopActivity);

  const startGathering = (budId: string) => {
    console.log('🟢 Starting gathering:', { budId, nodeId, isUnlocked });
    
    if (!isUnlocked || !budId) {
      console.log('❌ Cannot start gathering - unlocked or budId check failed');
      return false;
    }
    
    const success = moveBudToNode(budId, nodeId);
    console.log('📍 moveBudToNode result:', success);
    return success;
  };

  const stopGathering = (budId: string) => {
    console.log('🔴 Stopping gathering:', { budId, nodeId });
    return moveBudFromNodeToParty(budId, nodeId);
  };

  const isGathering = (budId: string) => 
    budActivities[budId]?.nodeId === nodeId;

  return { startGathering, stopGathering, isGathering };
};