import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/game.store';
import { GameConfig } from '../constants/gameConfig';

export const useAutoSave = () => {
  const saveGame = useGameStore((state) => state.saveGame);
  const isPaused = useGameStore((state) => state.isPaused);
  const isInitialLoad = useGameStore((state) => state.isInitialLoad);
  const autoSaveInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoSave = () => {
    if (!isPaused && !isInitialLoad && !autoSaveInterval.current) {
      autoSaveInterval.current = setInterval(() => {
        saveGame();
      }, GameConfig.SAVE.AUTO_INTERVAL);
    }
  };

  const stopAutoSave = () => {
    if (autoSaveInterval.current) {
      clearInterval(autoSaveInterval.current);
      autoSaveInterval.current = null;
    }
  };

  useEffect(() => {
    startAutoSave();
    return () => stopAutoSave();
  }, [saveGame, isPaused, isInitialLoad]);

  return { startAutoSave, stopAutoSave };
};