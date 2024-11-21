import './index.css';
import { useState, useEffect, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import OfflineProgressionModal from './components/common/OfflineProgressionModal';
import { calculateOfflineDuration, calculateResourcesGained, calculateHunterXPGained, calculateBudXPGained } from './utils/offlineProgression.utils';
import { useGameStore } from './stores/game.store';
import { useAutoSave } from './hooks/useAutoSave'; // Import the auto-save hook

const AppWithAutoSave = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [offlineData, setOfflineData] = useState({
    duration: 0,
    resources: {},
    hunterXP: 0,
    budXP: {},
  });

  // Define lastActiveTime
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());

  // Load game state on mount
  const loadGame = useGameStore((state) => state.loadGame);

  useEffect(() => {
    loadGame(); // Load the game state when the component mounts
  }, [loadGame]);

  // Use the auto-save hook
  useAutoSave();

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - lastActiveTime) / 1000; // Convert milliseconds to seconds

      // Assuming you have access to the game state
      const gameState = useGameStore.getState();

      const offlineDuration = calculateOfflineDuration(lastActiveTime);
      const resourcesGained = calculateResourcesGained(gameState, elapsedTime);
      const hunterXPGained = calculateHunterXPGained(gameState, elapsedTime);
      const budXPGained = calculateBudXPGained(gameState, elapsedTime);

      setOfflineData({
        duration: offlineDuration,
        resources: resourcesGained,
        hunterXP: hunterXPGained,
        budXP: budXPGained,
      });

      setModalOpen(true);
    } else {
      setLastActiveTime(Date.now());
    }
  };

  useEffect(() => {
    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <StrictMode>
      <App />
      <OfflineProgressionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        offlineDuration={offlineData.duration}
        resourcesGained={offlineData.resources}
        hunterXPGained={offlineData.hunterXP}
        budXPGained={offlineData.budXP}
      />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<AppWithAutoSave />);