import React, { useEffect, useState } from "react";
import { useViewStore } from "./stores/view.store";
import GameContainer from "./views/GameContainer";
import MiningView from "./views/gathering/MiningView";
import SmithingView from "./views/crafting/SmithingView";
import Sidebar from "./components/common/Sidebar";
import { GameLoop } from "./core/game-loop/game-loop";
import LumberingView from "./views/gathering/LumberingView";
import { useGameStore } from "./stores/game.store";
import { GameEvents } from "./core/game-events/game-events";
import { calculateOfflineProgress } from "./core/game-loop/offline-loop";

function App() {
  const currentView = useViewStore((state) => state.currentView);
  const gameStore = useGameStore();
  const gameEvents = GameEvents.getInstance();
  const [isWelcomeBackVisible, setIsWelcomeBackVisible] = useState(false);
  const [offlineData, setOfflineData] = useState({
    lastSaveTime: 0,
    currentTime: Date.now(),
    xpGained: 0,
    itemsGained: {} as Record<string, number>,
    itemsLost: {} as Record<string, number>,
  });

  useEffect(() => {
    const gameLoop = GameLoop.getInstance();

    // Start the game loop
    gameLoop.start();

    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Save and pause the game when leaving the screen
        gameStore.saveGame();
        gameStore.pauseGame();
        gameEvents.emit("gamePaused");
      } else {
        // Process offline progress when returning
        handleOfflineProgress();
      }
    };

    const handleOfflineProgress = () => {
      const offlineProgress = calculateOfflineProgress();
      if (offlineProgress) {
        setOfflineData({
          lastSaveTime: offlineProgress.lastSaveTime,
          currentTime: offlineProgress.currentTime,
          xpGained: offlineProgress.xpGained,
          itemsGained: offlineProgress.itemsGained,
          itemsLost: offlineProgress.itemsLost,
        });

        gameEvents.emit("offlineProgressCalculated", offlineProgress); // Emit progress event
        setIsWelcomeBackVisible(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      gameLoop.stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [gameStore, gameEvents]);

  const handleResumeGame = () => {
    setIsWelcomeBackVisible(false);
    gameStore.resumeGame();
  };

  const renderView = () => {
    switch (currentView) {
      case "mining":
        return <MiningView />;
      case "smithing":
        return <SmithingView />;
      case "lumbering":
        return <LumberingView />;
      default:
        return <div>Select a view to display.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-base-300">
      <Sidebar />
      <div className="flex-1">
        <GameContainer>{renderView()}</GameContainer>
      </div>

      {/* Welcome Back Popup */}
      {isWelcomeBackVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">Welcome Back!</h2>
            <p className="mb-2">
              <strong>Last Save Time:</strong> {new Date(offlineData.lastSaveTime).toLocaleString()}
            </p>
            <p className="mb-2">
              <strong>Current Time:</strong> {new Date(offlineData.currentTime).toLocaleString()}
            </p>
            <p className="mb-2">
              <strong>XP Gained:</strong> {offlineData.xpGained}
            </p>
            <div className="mb-2">
              <strong>Items Gained:</strong>
              {Object.keys(offlineData.itemsGained).length > 0 ? (
                <ul className="list-disc list-inside">
                  {Object.entries(offlineData.itemsGained).map(([itemId, quantity]) => (
                    <li key={itemId}>
                      {itemId}: {quantity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No items gained.</p>
              )}
            </div>
            <div className="mb-2">
              <strong>Items Lost:</strong>
              {Object.keys(offlineData.itemsLost).length > 0 ? (
                <ul className="list-disc list-inside">
                  {Object.entries(offlineData.itemsLost).map(([itemId, quantity]) => (
                    <li key={itemId}>
                      {itemId}: {quantity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No items lost.</p>
              )}
            </div>
            <button
              onClick={handleResumeGame}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Resume Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
