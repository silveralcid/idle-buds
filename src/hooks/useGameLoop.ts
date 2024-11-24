import { useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { useHunterStore } from '../stores/hunter.store';
import { GameConfig } from '../constants/game-config';

export const useGameLoop = () => {
  const isPaused = useGameStore((state) => state.isPaused);
  const processHunterTick = useHunterStore((state) => state.processHunterTick);
  const currentHunterActivity = useHunterStore((state) => state.currentHunterActivity);

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
        // Process activity ticks if there's an active activity
        if (currentHunterActivity) {
          processHunterTick();
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
  }, [isPaused, processHunterTick, currentHunterActivity]);
};