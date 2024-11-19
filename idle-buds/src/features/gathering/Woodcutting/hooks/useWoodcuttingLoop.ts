// hooks/useWoodcuttingLoop.ts
import { useEffect } from 'react';
import { useGameStore } from '../../../../stores/useStore';

export const useWoodcuttingLoop = () => {
  const { 
    woodcutting,
    updateChoppingProgress,
    addWoodcuttingExperience,
    addResource,
    stopChopping
  } = useGameStore();

  useEffect(() => {
    if (!woodcutting.isChopping || !woodcutting.currentTree) return;

    const intervalId = setInterval(() => {
      const newProgress = woodcutting.progress + 100;

      if (newProgress >= woodcutting.currentTree.timeToChop) {
        // Completed a chop
        addWoodcuttingExperience(woodcutting.currentTree.xpPerCut);
        addResource(woodcutting.currentTree.resourceName, 1);
        updateChoppingProgress(0);
      } else {
        updateChoppingProgress(newProgress);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [woodcutting.isChopping, woodcutting.progress, woodcutting.currentTree]);
};
