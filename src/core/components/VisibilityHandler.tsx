import { useEffect } from 'react';
import { useGameStore } from '../game.store';
export function VisibilityHandler() {
  const handleVisibilityChange = useGameStore(state => state.handleVisibilityChange);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  return null;
} 