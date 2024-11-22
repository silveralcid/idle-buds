import { useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { useHunterStore } from '../stores/hunter.store';
import { useActiveBudStore } from '../stores/active-bud.store';
import { GameConfig } from '../constants/game-config';
import { processGathering } from '../utils/gathering.utils';

export const useGameLoop = () => {
  const isPaused = useGameStore((state) => state.isPaused);
  const updateHunterActivityProgress = useHunterStore((state) => state.updateHunterActivityProgress);
  const updateBudProgress = useActiveBudStore((state) => state.updateBudProgress);
  const hunterActivity = useHunterStore((state) => state.currentActivity);
  const budActivities = useActiveBudStore((state) => state.budActivities);

  useEffect(() => {
    let lastTime = performance.now();
    let accumulatedTime = 0;
    const tickDuration = GameConfig.TICK.DURATION;
    let animationFrameId: number;

    const gameLoop = (currentTime: number) => {
      if (isPaused) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      accumulatedTime += deltaTime * 1000; // Convert to milliseconds

      while (accumulatedTime >= tickDuration) {
        const tickDeltaTime = tickDuration / 1000; // Convert to seconds

        // Update fractional progress for both hunter and buds
        if (hunterActivity) {
          updateHunterActivityProgress(tickDeltaTime);
        }
        
        if (Object.keys(budActivities).length > 0) {
          updateBudProgress(tickDeltaTime);
        }

        // Process gathering for both hunter and buds if there are active gatherers
        if (hunterActivity || Object.keys(budActivities).length > 0) {
          processGathering(tickDeltaTime);
        }

        accumulatedTime -= tickDuration;
      }

      lastTime = currentTime;
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    isPaused, 
    updateHunterActivityProgress, 
    updateBudProgress, 
    hunterActivity, 
    budActivities
  ]);
};