import { useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { useAutoSave } from './useAutoSave';

export const useOfflineProgression = (setModalVisible: (visible: boolean) => void) => {
  const saveGame = useGameStore((state) => state.saveGame);
  const pauseGame = useGameStore((state) => state.pauseGame);
  const stopAutoSave = useAutoSave();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (typeof stopAutoSave === 'function') {
          stopAutoSave();
        }
        pauseGame();
      } else {
        setModalVisible(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveGame, pauseGame, stopAutoSave, setModalVisible]);
};