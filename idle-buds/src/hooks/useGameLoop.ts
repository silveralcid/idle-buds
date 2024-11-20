import { useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { GameConfig } from '../constants/game-config';

export const useGameLoop = () => {
  const updateResources = useGameStore((state) => state.updateResources);
  const isGathering = useGameStore((state) => state.isGathering);

  useEffect(() => {
    let lastTime = performance.now();
    const tickRate = 1000 / GameConfig.ticksPerSecond;
    let animationFrameId: number;

    const gameLoop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      if (isGathering) {
        updateResources(deltaTime);
      }
      lastTime = currentTime;
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isGathering, updateResources]);
};