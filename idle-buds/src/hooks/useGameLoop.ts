import { useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { GameConfig } from '../constants/gameConfig';

export const useGameLoop = () => {
  const updateResources = useGameStore((state) => state.updateResources);
  const isGathering = useGameStore((state) => state.isGathering);
  const isPaused = useGameStore((state) => state.isPaused);

  useEffect(() => {
    let lastTime = performance.now();
    let accumulatedTime = 0;
    const tickDuration = GameConfig.tickDuration;
    let animationFrameId: number;

    const gameLoop = (currentTime: number) => {
      if (isPaused) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      const deltaTime = (currentTime - lastTime) / 1000;
      accumulatedTime += deltaTime * 1000; // Convert to milliseconds

      while (accumulatedTime >= tickDuration) {
        if (isGathering) {
          updateResources(tickDuration / 1000); // Pass tick duration in seconds
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
  }, [isGathering, updateResources, isPaused]);
};