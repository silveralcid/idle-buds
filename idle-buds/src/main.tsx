import './index.css';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { useAutoSave } from './hooks/useAutoSave';
import { useOfflineProgression } from './hooks/useOfflineProgression';
import { useGameStore } from './stores/game.store';

const AppWithAutoSaveAndOfflineProgression = () => {
  useAutoSave();
  useOfflineProgression();

  const loadGame = useGameStore((state) => state.loadGame);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<AppWithAutoSaveAndOfflineProgression />);