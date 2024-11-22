import './index.css';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { useAutoSave } from './hooks/useAutoSave';
import { useOfflineProgression } from './hooks/useOfflineProgression';
import { useGameStore } from './stores/game.store';
import OfflineProgressionModal from './components/common/OfflineProgressionModal';
import { handleOfflineProgression } from './utils/offlineProgression.utils';
import { miningItems } from './data/items/ore.data';
import { lumberingItems } from './data/items/log.data';

const AppWithAutoSaveAndOfflineProgression = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [progressionData, setProgressionData] = useState({
    hunterResources: {} as Record<string, number>,
    budResources: {} as Record<string, number>,
    hunterExperience: {} as Record<string, number>,
    budExperience: {} as Record<string, number>
  });

  // Combine all items for name lookup
  const allItems = [...miningItems, ...lumberingItems];
  const getItemName = (itemId: string) => {
    const item = allItems.find(item => item.id === itemId);
    return item ? item.name : itemId;
  };

  useAutoSave();
  useOfflineProgression(setModalVisible, setProgressionData);

  const loadGame = useGameStore((state) => state.loadGame);

  useEffect(() => {
    loadGame();
    handleOfflineProgression(setProgressionData, setModalVisible);
  }, [loadGame]);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <StrictMode>
      <OfflineProgressionModal 
        isVisible={isModalVisible} 
        onClose={handleCloseModal} 
        progressionData={progressionData}
        getItemName={getItemName}
      />
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<AppWithAutoSaveAndOfflineProgression />);