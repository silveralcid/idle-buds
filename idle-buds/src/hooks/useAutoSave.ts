import { useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { GameConfig } from '../constants/gameConfig';

export const useAutoSave = () => {
  const saveGame = useGameStore((state) => state.saveGame);
  const isPaused = useGameStore((state) => state.isPaused);
  let autoSaveInterval: ReturnType<typeof setInterval>;

  useEffect(() => {
    autoSaveInterval = setInterval(() => {
      if (!isPaused) {
        saveGame();
      }
    }, GameConfig.autoSaveInterval);

    return () => clearInterval(autoSaveInterval);
  }, [saveGame, isPaused]);

  return () => clearInterval(autoSaveInterval);
};