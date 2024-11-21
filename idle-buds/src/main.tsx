import './index.css';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { useAutoSave } from './hooks/useAutoSave';
import { useOfflineProgression } from './hooks/useOfflineProgression';
import { useGameStore } from './stores/game.store';
import OfflineProgressionModal from './components/common/OfflineProgressionModal';

const AppWithAutoSaveAndOfflineProgression = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  useAutoSave();
  useOfflineProgression(setModalVisible);

  const loadGame = useGameStore((state) => state.loadGame);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <StrictMode>
      <OfflineProgressionModal isVisible={isModalVisible} onClose={handleCloseModal} />
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<AppWithAutoSaveAndOfflineProgression />);