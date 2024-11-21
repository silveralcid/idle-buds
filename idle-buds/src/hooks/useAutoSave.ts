import { useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { GameConfig } from '../constants/gameConfig';

export const useAutoSave = () => {
  const saveGame = useGameStore((state) => state.saveGame);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      saveGame();
    }, GameConfig.autoSaveInterval);

    return () => clearInterval(autoSaveInterval);
  }, [saveGame]);
};