import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { useAutoSave } from './hooks/useAutoSave';
import { loadGameState } from './utils/saveLoad.utils';

const AppWithAutoSave = () => {
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      console.log('Game state loaded:', savedState);
    }
  }, []);

  useAutoSave();

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<AppWithAutoSave />);