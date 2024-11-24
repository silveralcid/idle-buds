import './index.css';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { useAutoSave } from './hooks/useAutoSave';
import { useGameStore } from './stores/game.store';
import { miningItems } from './data/items/ore.data';
import { lumberingItems } from './data/items/log.data';

const AppMain = () => {
  // Game initialization hooks
  useAutoSave();
  const loadGame = useGameStore((state) => state.loadGame);

  // Load saved game on mount
  useEffect(() => {
    loadGame();
  }, [loadGame]);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

// Item utility functions should be moved to a separate utils file
const allItems = [...miningItems, ...lumberingItems];
export const getItemName = (itemId: string) => {
  const item = allItems.find(item => item.id === itemId);
  return item ? item.name : itemId;
};

createRoot(document.getElementById('root')!).render(<AppMain />);