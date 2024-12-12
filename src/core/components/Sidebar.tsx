import React from "react";
import { useState } from "react";
import { useMiningStore } from "../../features/mining/mining.store";
import { useSmithingStore } from "../../features/smithing/smithing.store"; // Import Smithing store
import { useBankStore } from "../../features/bank/bank.store";
import { useViewStore } from "../view.store";
import { useGameStore } from "../game.store";
import { useLumberingStore } from "../../features/lumbering/lumbering.store";

const Sidebar: React.FC = () => {
  // Access mining state
  const xpMining = useMiningStore((state) => state.xp);
  const levelMining = useMiningStore((state) => state.level);
  const xpToNextLevelMining = useMiningStore((state) => state.xpToNextLevel());

  const progressMining = xpToNextLevelMining > 0 ? xpMining / xpToNextLevelMining : 0;

  // Access smithing state
  const xpSmithing = useSmithingStore((state) => state.xp);
  const levelSmithing = useSmithingStore((state) => state.level);
  const xpToNextLevelSmithing = useSmithingStore((state) => state.xpToNextLevel());

  const progressSmithing = xpToNextLevelSmithing > 0 ? xpSmithing / xpToNextLevelSmithing : 0;

  // Access lumbering state
  const xpLumbering = useLumberingStore((state) => state.xp);
  const levelLumbering = useLumberingStore((state) => state.level);
  const xpToNextLevelLumbering = useLumberingStore((state) => state.xpToNextLevel());

  const progressLumbering = xpToNextLevelLumbering > 0 ? xpLumbering / xpToNextLevelLumbering : 0;

  // Access bank items
  const bankItems = useBankStore((state) => state.items);

  // View navigation
  const setView = useViewStore((state) => state.setView);

  const navigateToMining = () => {
    setView("MiningView");
  };

  const navigateToSmithing = () => {
    setView("SmithingView");
  };

  const navigateToLumbering = () => {
    setView("LumberingView");
  };

  const navigateToBank = () => {
    setView("BankView");
  };

  const navigateToBudBox = () => {
    setView("BudBoxView");
  };

  const navigateToTesting = () => {
    setView("TestingView");
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Game control
  const { saveGame, loadGame, resetGame, pauseGame, startGame, deleteSave } = useGameStore();

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-lg font-bold mb-4">Idle Buds</h2>

      {/* Game Controls Section */}
      <div className="mb-6">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center justify-between w-full text-md font-semibold mb-2 p-2 hover:bg-gray-700 rounded"
        >
          <span>Game Controls</span>
          <span
            className="transform transition-transform duration-200"
            style={{
              transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </button>

        {isMenuOpen && (
          <div className="flex flex-col gap-2">
            <button
              onClick={startGame}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
            >
              Start Game
            </button>
            <button
              onClick={pauseGame}
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
            >
              Pause Game
            </button>
            <button
              onClick={resetGame}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Reset Game
            </button>
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
              onClick={deleteSave}
              className="bg-red-800 hover:bg-red-900 px-4 py-2 rounded"
            >
              Delete Save
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
      <div className="flex flex-col gap-2">
        <button
          onClick={navigateToTesting}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Testing
        </button>
        <button
          onClick={navigateToBank}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Bank
        </button>
        <button
          onClick={navigateToBudBox}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Budbox
        </button>
      </div>
    </div>
 

      {/* Mining Section */}
      <div className="mb-6 cursor-pointer" onClick={navigateToMining}>
        <h3 className="text-md font-semibold mb-2 hover:text-gray-300">Mining</h3>
        <p>
          Level: {levelMining} | XP: {xpMining.toFixed(0)}/{xpToNextLevelMining.toFixed(0)}
        </p>
        <div className="h-2 bg-gray-600 rounded mt-1">
          <div
            className="h-full bg-green-500 rounded"
            style={{ width: `${(progressMining * 100).toFixed(0)}%` }}
          ></div>
        </div>
      </div>

      {/* Smithing Section */}
      <div className="mb-6 cursor-pointer" onClick={navigateToSmithing}>
        <h3 className="text-md font-semibold mb-2 hover:text-gray-300">Smithing</h3>
        <p>
          Level: {levelSmithing} | XP: {xpSmithing.toFixed(0)}/{xpToNextLevelSmithing.toFixed(0)}
        </p>
        <div className="h-2 bg-gray-600 rounded mt-1">
          <div
            className="h-full bg-orange-500 rounded"
            style={{ width: `${(progressSmithing * 100).toFixed(0)}%` }}
          ></div>
        </div>
      </div>

      {/* Lumbering Section */}
      <div className="mb-6 cursor-pointer" onClick={navigateToLumbering}>
        <h3 className="text-md font-semibold mb-2 hover:text-gray-300">Lumbering</h3>
        <p>
          Level: {levelLumbering} | XP: {xpLumbering.toFixed(0)}/{xpToNextLevelLumbering.toFixed(0)}
        </p>
        <div className="h-2 bg-gray-600 rounded mt-1">
          <div
            className="h-full bg-green-500 rounded"
            style={{ width: `${(progressLumbering * 100).toFixed(0)}%` }}
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
