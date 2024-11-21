import { useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { useAutoSave } from './useAutoSave';
import { calculateOfflineProgression } from '../utils/offlineProgression.utils';

export const useOfflineProgression = (setModalVisible: (visible: boolean) => void, setProgressionData: (data: any) => void) => {
  const saveGame = useGameStore((state) => state.saveGame);
  const pauseGame = useGameStore((state) => state.pauseGame);
  const stopAutoSave = useAutoSave();

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
        console.log('Calculating offline progression');
        const lastSaveTime = useGameStore.getState().lastSaveTime;
        const currentTime = Date.now();
        const deltaTime = (currentTime - lastSaveTime) / 1000;

        console.log('Last save time:', new Date(lastSaveTime).toLocaleString());
        console.log('Current time:', new Date(currentTime).toLocaleString());
        console.log('Delta time (seconds):', deltaTime);

        const state = useGameStore.getState();
        const progressionData = calculateOfflineProgression(state, deltaTime);
        console.log('Progression data:', progressionData);
        setProgressionData(progressionData);

        setModalVisible(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveGame, pauseGame, stopAutoSave, setModalVisible, setProgressionData]);
};