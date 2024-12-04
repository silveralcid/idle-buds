import React, { useEffect } from "react";
import { useViewStore } from "./core/view.store";
import GameContainer from "./views/GameContainer";
import MiningView from "./views/MiningView";
import Sidebar from "./core/components/Sidebar";
import { GameLoop } from "./core/game-loop";
import { GameEvents } from "./core/game-events";
import { processMiningTick } from "./features/mining/mining.logic";
import { ResumeModal } from "./core/components/ResumeModal";
import { VisibilityHandler } from "./core/components/VisibilityHandler";

function App() {
  const currentView = useViewStore((state) => state.currentView);

  useEffect(() => {
    // Initialize the game loop
    const gameLoop = GameLoop.getInstance();
    const gameEvents = GameEvents.getInstance();

    // Add the mining tick to the game events
    const handleGameTick = (deltaTime: number) => {
      processMiningTick(deltaTime);
    };

    gameEvents.on("gameTick", handleGameTick);

    gameLoop.start();

    // Cleanup on unmount
    return () => {
      gameLoop.stop();
      gameEvents.off("gameTick", handleGameTick);
    };
  }, []);

  const renderView = () => {
    switch (currentView) {
      case "MiningView":
        return <MiningView />;
      default:
        return <div>No view found.</div>;
    }
  };

  return (
    <>
      <ResumeModal />
      <VisibilityHandler />
      <div className="flex h-screen">
        <Sidebar /> {/* Sidebar on the left */}
        <main className="flex-1 p-4 bg-base-300">
          <GameContainer>{renderView()}</GameContainer>
        </main>
      </div>
    </>
  );
}

export default App;
