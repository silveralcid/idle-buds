import { useHunterStore } from '../stores/hunter.store';

export const useHunterGathering = (nodeId: string, isUnlocked: boolean) => {
  const hunterActivity = useHunterStore((state) => state.currentHunterActivity);

  const startGathering = () => {
    if (!isUnlocked) {
      console.warn('❌ Cannot start gathering - node is locked');
      return false;
    }

    // Check if already gathering at a different node
    if (hunterActivity?.type === 'gathering' && hunterActivity.nodeId !== nodeId) {
      console.warn('❌ Already gathering at a different node');
      return false;
    }

    // Check if currently crafting
    if (hunterActivity?.type === 'crafting') {
      console.warn('❌ Cannot gather while crafting');
      return false;
    }

    useHunterStore.getState().startHunterGathering(nodeId);
    console.log('✅ Started gathering at node:', nodeId);
    return true;
  };

  const stopGathering = () => {
    if (!isGathering) {
      console.warn('❌ Not currently gathering at this node');
      return false;
    }

    useHunterStore.getState().stopHunterActivity();
    console.log('✅ Stopped gathering at node:', nodeId);
    return true;
  };

  const getGatheringProgress = () => {
    return useHunterStore.getState().getHunterGatheringProgress(nodeId);
  };

  const isGathering = 
    hunterActivity?.type === 'gathering' && 
    hunterActivity.nodeId === nodeId;

  const gatheringProgress = isGathering 
    ? hunterActivity.gatheringProgress 
    : null;

  return {
    startGathering,
    stopGathering,
    isGathering,
    gatheringProgress,
    getGatheringProgress,
  };
};