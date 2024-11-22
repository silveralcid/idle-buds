import { useHunterStore } from '../stores/hunter.store';

export const useHunterGathering = (nodeId: string, isUnlocked: boolean) => {
  const hunterActivity = useHunterStore((state) => state.currentActivity);

  const startGathering = () => {
    if (!isUnlocked) {
      console.log('❌ Cannot start gathering - node is locked');
      return false;
    }
    
    useHunterStore.getState().startHunterActivity('gathering', nodeId);
    console.log('✅ Started hunter gathering:', { nodeId });
    return true;
  };

  const stopGathering = () => {
    if (hunterActivity?.nodeId === nodeId) {
      useHunterStore.getState().stopHunterActivity();
      console.log('✅ Stopped hunter gathering:', { nodeId });
      return true;
    }
    return false;
  };

  const isGathering = hunterActivity?.type === 'gathering' && hunterActivity?.nodeId === nodeId;

  return { startGathering, stopGathering, isGathering };
};