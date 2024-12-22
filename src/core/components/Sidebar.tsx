import React from "react";
import { useState } from "react";
import { useMiningStore } from "../../features/mining/mining.store";
import { useSmithingStore } from "../../features/smithing/smithing.store"; // Import Smithing store
import { useBankStore } from "../../features/bank/bank.store";
import { useViewStore } from "../view.store";
import { useGameStore } from "../game.store";
import { useLumberingStore } from "../../features/lumbering/lumbering.store";
import { useTendingStore } from "../../features/tending/tending.store";
import PartyDisplay from '../../features/party/components/PartyDisplay';

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

  const navigateToFishing = () => {
    setView("FishingView");
  };

  const navigateToCooking = () => {
    setView("CookingView");
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

  const navigateToTending = () => {
    setView("TendingView");
  };

  const navigateToShop = () => {
    setView("ShopView");
  };

  const navigateToAssignment = () => {
    setView("AssignmentView");
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Game control
  const { saveGame, loadGame, resetGame, pauseGame, startGame, deleteSave } = useGameStore();

  // Access tending state
  const xpTending = useTendingStore((state) => state.xp);
  const levelTending = useTendingStore((state) => state.level);
  const xpToNextLevelTending = useTendingStore((state) => state.xpToNextLevel());

  const progressTending = xpToNextLevelTending > 0 ? xpTending / xpToNextLevelTending : 0;

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
            onClick={navigateToAssignment}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Assignment
          </button>
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
        <button
          onClick={navigateToShop}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Shop
        </button>
      </div>
    </div>

      {/* Party Display */}
      <PartyDisplay />

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

      {/* Tending Section */}
      <div className="mb-6 cursor-pointer" onClick={navigateToTending}>
        <h3 className="text-md font-semibold mb-2 hover:text-gray-300">Tending</h3>
        <p>
          Level: {levelTending} | XP: {xpTending.toFixed(0)}/{xpToNextLevelTending.toFixed(0)}
        </p>
        <div className="h-2 bg-gray-600 rounded mt-1">
          <div
            className="h-full bg-purple-500 rounded"
            style={{ width: `${(progressTending * 100).toFixed(0)}%` }}
          ></div>
        </div>
      </div>

       {/* Fishing Section */}
       <div className="mb-6 cursor-pointer" onClick={navigateToFishing}>
        <h3 className="text-md font-semibold mb-2 hover:text-gray-300">Fishing</h3>
      </div>

      {/* Cooking Section */}
      <div className="mb-6 cursor-pointer" onClick={navigateToCooking}>
        <h3 className="text-md font-semibold mb-2 hover:text-gray-300">Cooking</h3>
      </div>

    </aside>
  );
};

export default Sidebar;
