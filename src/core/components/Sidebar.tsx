import React from "react";
import { useMiningStore } from "../../features/mining/mining.store";
import { useBankStore } from "../../features/bank/bank.state";
import { useViewStore } from "../view.store";

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
  
    return (
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-4">Idle Buds</h2>
  
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
  