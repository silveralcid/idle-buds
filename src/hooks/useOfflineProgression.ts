// src/hooks/useOfflineProgression.ts
import { useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { useAutoSave } from './useAutoSave';
import { handleOfflineProgression } from '../utils/offline-progression.utils';

export const useOfflineProgression = (
  setModalVisible: (visible: boolean) => void,
  setProgressionData: (data: any) => void
) => {
  const pauseGame = useGameStore((state) => state.pauseGame);
  const { stopAutoSave } = useAutoSave();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopAutoSave();
        pauseGame();
      } else {
        handleOfflineProgression(setProgressionData, setModalVisible);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pauseGame, stopAutoSave, setModalVisible, setProgressionData]);
};