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
import EquipmentDisplay from "../../features/equipment/components/EquipmentDisplay";

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

  const navigateToCombat = () => {
    setView("CombatView");
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPartyOpen, setIsPartyOpen] = useState(true);
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
  const [isBankOpen, setIsBankOpen] = useState(true);

  // Game control
  const { saveGame, loadGame, resetGame, pauseGame, startGame, deleteSave } = useGameStore();

  // Access tending state
  const xpTending = useTendingStore((state) => state.xp);
  const levelTending = useTendingStore((state) => state.level);
  const xpToNextLevelTending = useTendingStore((state) => state.xpToNextLevel());

  const progressTending = xpToNextLevelTending > 0 ? xpTending / xpToNextLevelTending : 0;

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen flex flex-col">
      {/* Header Section - Fixed */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold">Idle Buds</h2>
      </div>

       {/* Scrollable Content Section */}
       <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-6">
          {/* Game Controls Section */}
          <div className="border-b border-gray-700 pb-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-between w-full text-md font-semibold p-2 hover:bg-gray-700 rounded"
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
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button onClick={startGame} className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-sm">
                  Start
                </button>
                <button onClick={pauseGame} className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-sm">
                  Pause
                </button>
                <button onClick={saveGame} className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-sm">
                  Save
                </button>
                <button onClick={loadGame} className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-sm">
                  Load
                </button>
                <button onClick={resetGame} className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-sm col-span-2">
                  Reset Game
                </button>
                <button onClick={deleteSave} className="bg-red-800 hover:bg-red-900 px-2 py-1 rounded text-sm col-span-2">
                  Delete Save
                </button>
              </div>
            )}
          </div>

          {/* Navigation Section */}
          <div className="border-b border-gray-700 pb-4">
            <div className="grid grid-cols-2 gap-2">
              <button onClick={navigateToAssignment} className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm">
                Assignment
              </button>
              <button onClick={navigateToTesting} className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm">
                Testing
              </button>
              <button onClick={navigateToBank} className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm">
                Bank
              </button>
              <button onClick={navigateToBudBox} className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm">
                Budbox
              </button>
              <button onClick={navigateToShop} className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm col-span-2">
                Shop
              </button>
            </div>
          </div>


            {/* Party Display */}
            <div className="border-b border-gray-700 pb-4">
            <button
              onClick={() => setIsPartyOpen(!isPartyOpen)}
              className="flex items-center justify-between w-full text-md font-semibold p-2 hover:bg-gray-700 rounded"
            >
              <span>Party</span>
              <span
                className="transform transition-transform duration-200"
                style={{
                  transform: isPartyOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ▼
              </span>
            </button>

            {isPartyOpen && <PartyDisplay />}
          </div>

                  {/* Bank Items - Scrollable Section */}
                  <div className="border-b border-gray-700 pb-4">
            <button
              onClick={() => setIsBankOpen(!isBankOpen)}
              className="flex items-center justify-between w-full text-md font-semibold p-2 hover:bg-gray-700 rounded"
            >
              <span>Bank</span>
              <span
                className="transform transition-transform duration-200"
                style={{
                  transform: isBankOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ▼
              </span>
            </button>

            {isBankOpen && (
              <div className="max-h-32 overflow-y-auto custom-scrollbar pr-2 mt-2">
                <ul className="space-y-1">
                  {Object.entries(bankItems).map(([itemId, quantity]) => (
                    <li key={itemId} className="text-sm">
                      {itemId}: {Math.floor(quantity)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Equipment - Scrollable Section */}
          <div className="border-b border-gray-700 pb-4">
            <button
              onClick={() => setIsEquipmentOpen(!isEquipmentOpen)}
              className="flex items-center justify-between w-full text-md font-semibold p-2 hover:bg-gray-700 rounded"
            >
              <span>Equipment</span>
              <span
                className="transform transition-transform duration-200"
                style={{
                  transform: isEquipmentOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ▼
              </span>
            </button>

            {isEquipmentOpen && (
              <div>
                <EquipmentDisplay />
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="space-y-4">


            {/* Fishing */}
            <div className="cursor-pointer hover:bg-gray-700 p-2 rounded" onClick={navigateToCombat}>
              <h3 className="text-md font-semibold mb-1">Combat</h3>
              
            </div>
            {/* Mining */}
            <div className="cursor-pointer hover:bg-gray-700 p-2 rounded" onClick={navigateToMining}>
              <h3 className="text-md font-semibold mb-1">Mining</h3>
              <p className="text-sm">
                Level: {levelMining} | XP: {xpMining.toFixed(0)}/{xpToNextLevelMining.toFixed(0)}
              </p>
              <div className="h-1.5 bg-gray-600 rounded mt-1">
                <div
                  className="h-full bg-green-500 rounded"
                  style={{ width: `${(progressMining * 100).toFixed(0)}%` }}
                ></div>
              </div>
            </div>

            {/* Smithing */}
            <div className="cursor-pointer hover:bg-gray-700 p-2 rounded" onClick={navigateToSmithing}>
              <h3 className="text-md font-semibold mb-1">Smithing</h3>
              <p className="text-sm">
                Level: {levelSmithing} | XP: {xpSmithing.toFixed(0)}/{xpToNextLevelSmithing.toFixed(0)}
              </p>
              <div className="h-1.5 bg-gray-600 rounded mt-1">
                <div
                  className="h-full bg-orange-500 rounded"
                  style={{ width: `${(progressSmithing * 100).toFixed(0)}%` }}
                ></div>
              </div>
            </div>

            {/* Lumbering */}
            <div className="cursor-pointer hover:bg-gray-700 p-2 rounded" onClick={navigateToLumbering}>
              <h3 className="text-md font-semibold mb-1">Lumbering</h3>
              <p className="text-sm">
                Level: {levelLumbering} | XP: {xpLumbering.toFixed(0)}/{xpToNextLevelLumbering.toFixed(0)}
              </p>
              <div className="h-1.5 bg-gray-600 rounded mt-1">
                <div
                  className="h-full bg-green-500 rounded"
                  style={{ width: `${(progressLumbering * 100).toFixed(0)}%` }}
                ></div>
              </div>
            </div>

            {/* Tending */}
            <div className="cursor-pointer hover:bg-gray-700 p-2 rounded" onClick={navigateToTending}>
              <h3 className="text-md font-semibold mb-1">Tending</h3>
              <p className="text-sm">
                Level: {levelTending} | XP: {xpTending.toFixed(0)}/{xpToNextLevelTending.toFixed(0)}
              </p>
              <div className="h-1.5 bg-gray-600 rounded mt-1">
                <div
                  className="h-full bg-purple-500 rounded"
                  style={{ width: `${(progressTending * 100).toFixed(0)}%` }}
                ></div>
              </div>
            </div>

            {/* Fishing */}
            <div className="cursor-pointer hover:bg-gray-700 p-2 rounded" onClick={navigateToFishing}>
              <h3 className="text-md font-semibold mb-1">Fishing</h3>
            </div>

            {/* Cooking */}
            <div className="cursor-pointer hover:bg-gray-700 p-2 rounded" onClick={navigateToCooking}>
              <h3 className="text-md font-semibold mb-1">Cooking</h3>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
