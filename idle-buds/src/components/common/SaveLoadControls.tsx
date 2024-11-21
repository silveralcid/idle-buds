import React from 'react';
import { useGameStore } from '../../stores/game.store';

const SaveLoadControls = () => {
  const saveGame = useGameStore((state) => state.saveGame);
  const loadGame = useGameStore((state) => state.loadGame);
  const resetGame = useGameStore((state) => state.resetGame);

  return (
    <div className="space-x-2">
      <button onClick={saveGame} className="btn">Save Game</button>
      <button onClick={loadGame} className="btn">Load Game</button>
      <button onClick={resetGame} className="btn">Reset Game</button>
    </div>
  );
};

export default SaveLoadControls;