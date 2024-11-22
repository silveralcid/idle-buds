import { useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { useActivityStore } from '../stores/activity.store';
import { GameConfig } from '../constants/game-config';
import { processGathering } from '../utils/gathering.utils';

export const useGameLoop = () => {
  const isPaused = useGameStore((state) => state.isPaused);
  const updateProgress = useActivityStore((state) => state.updateProgress);
  const hunterActivity = useActivityStore((state) => state.hunterActivity);
  const budActivities = useActivityStore((state) => state.budActivities);

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

        // Update fractional progress for all active gatherers
        updateProgress(tickDeltaTime);

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
  }, [isPaused, updateProgress, hunterActivity, budActivities]);
};