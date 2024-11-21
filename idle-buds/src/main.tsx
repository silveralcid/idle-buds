import './index.css';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { useAutoSave } from './hooks/useAutoSave';
import { useOfflineProgression } from './hooks/useOfflineProgression';
import { useGameStore } from './stores/game.store';
import OfflineProgressionModal from './components/common/OfflineProgressionModal';
import { calculateOfflineProgression } from './utils/offlineProgression.utils';

const AppWithAutoSaveAndOfflineProgression = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [progressionData, setProgressionData] = useState({
    hunterResources: {},
    budResources: {},
    hunterExperience: {},
    budExperience: {}
  });

  console.log('Initial modal visibility:', isModalVisible);
  console.log('Initial progression data:', progressionData);

  useAutoSave();
  useOfflineProgression(setModalVisible, setProgressionData);

  const loadGame = useGameStore((state) => state.loadGame);

  useEffect(() => {
    loadGame();
    
    // Calculate offline progression on initial load
    const lastSaveTime = useGameStore.getState().lastSaveTime;
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastSaveTime) / 1000;

    if (deltaTime > 0) {
      const state = useGameStore.getState();
      const progressionData = calculateOfflineProgression(state, deltaTime);
      setProgressionData(progressionData);
      setModalVisible(true);
    }
  }, [loadGame]);

  const handleCloseModal = () => {
    console.log('Closing modal');
    setModalVisible(false);
  };

  return (
    <StrictMode>
      <OfflineProgressionModal isVisible={isModalVisible} onClose={handleCloseModal} progressionData={progressionData} />
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<AppWithAutoSaveAndOfflineProgression />);