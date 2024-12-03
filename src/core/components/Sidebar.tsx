import React from "react";
import { useMiningStore } from "../../features/mining/mining.store";
import { useBankStore } from "../../features/bank/bank.store";
import { useViewStore } from "../view.store";
import { useGameStore } from "../game.store";

const Sidebar: React.FC = () => {
    // Access mining state
    const xp = useMiningStore((state) => state.xp);
    const level = useMiningStore((state) => state.level);
    const xpToNextLevel = useMiningStore((state) => state.xpToNextLevel()); // Call the function
  
    const progress = xpToNextLevel > 0 ? xp / xpToNextLevel : 0; // Prevent divide by zero
  
    // Access bank items
    const bankItems = useBankStore((state) => state.items);
  
    // View navigation
    const setView = useViewStore((state) => state.setView);
  
    const navigateToMining = () => {
      setView("MiningView");
    };
    
    // Game control
    const { saveGame, loadGame, resetGame, stopGame, startGame } = useGameStore();
  
    return (
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-4">Idle Buds</h2>

                {/* Game Controls Section */}
                <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Game Controls</h3>
          <div className="flex flex-col gap-2">
            <button 
              onClick={saveGame}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Save Game
            </button>
            <button 
              onClick={loadGame}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Load Game
            </button>
            <button 
              onClick={resetGame}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Reset Game
            </button>
            <button 
              onClick={stopGame}
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
            >
              Pause Game
            </button>
            <button 
              onClick={startGame}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
            >
              Start Game
            </button>
          </div>
        </div>
  
        {/* Mining Section */}
        <div className="mb-6 cursor-pointer" onClick={navigateToMining}>
          <h3 className="text-md font-semibold mb-2 hover:text-gray-300">Mining</h3>
          <p>
            Level: {level} | XP: {xp.toFixed(0)}/{xpToNextLevel.toFixed(0)}
          </p>
          <div className="h-2 bg-gray-600 rounded mt-1">
            <div
              className="h-full bg-green-500 rounded"
              style={{ width: `${(progress * 100).toFixed(0)}%` }}
            ></div>
          </div>
        </div>
  
        {/* Bank Items */}
        <div>
        <h3 className="text-md font-semibold mb-2">Bank Items</h3>
        <ul>
            {Object.entries(bankItems).map(([itemId, quantity]) => (
            <li key={itemId}>
                {itemId}: {Math.floor(quantity)}
            </li>
            ))}
        </ul>
        </div>

      </aside>
    );
  };
  
  export default Sidebar;
  