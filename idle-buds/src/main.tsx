import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { useAutoSave } from './hooks/useAutoSave';
import { useOfflineProgression } from './hooks/useOfflineProgression'; // Import the hook
import { loadGameState } from './utils/saveLoad.utils.ts';

const AppWithAutoSave = () => {
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      console.log('Game state loaded:', savedState);
    }
  }, []);

  useAutoSave();
  useOfflineProgression(); // Use the hook

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<AppWithAutoSave />);