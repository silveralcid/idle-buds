import { useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { useAutoSave } from './useAutoSave';
import { calculateOfflineProgression, handleOfflineProgression } from '../utils/offlineProgression.utils';

export const useOfflineProgression = (setModalVisible: (visible: boolean) => void, setProgressionData: (data: any) => void) => {
  const saveGame = useGameStore((state) => state.saveGame);
  const pauseGame = useGameStore((state) => state.pauseGame);
  const { stopAutoSave } = useAutoSave();

  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log('Visibility changed:', document.visibilityState);
      if (document.visibilityState === 'hidden') {
        if (typeof stopAutoSave === 'function') {
          console.log('Stopping auto-save');
          stopAutoSave();
        }
        console.log('Pausing game');
        pauseGame();
      } else {
        handleOfflineProgression(setProgressionData, setModalVisible);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveGame, pauseGame, stopAutoSave, setModalVisible, setProgressionData]);
};