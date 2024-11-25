import React, { useEffect } from "react";
import { useViewStore } from "./stores/view.store";
import GameContainer from "./views/GameContainer";
import MiningView from "./views/gathering/MiningView";
import SmithingView from "./views/crafting/SmithingView";
import Sidebar from "./components/common/Sidebar";
import { GameLoop } from "./core/game-loop/game-loop";
import LumberingView from "./views/gathering/LumberingView";
import { useGameStore } from "./stores/game.store";

function App() {
  const currentView = useViewStore((state) => state.currentView);

  useEffect(() => {
    const gameLoop = GameLoop.getInstance();
    const gameStore = useGameStore.getState();

    console.log("Starting game loop and autosave...");
    gameLoop.start();
    gameStore.startAutosave(); 

    return () => {
      console.log("Stopping game loop...");
      gameLoop.stop();
    };
  }, []);

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
    </div>
  );
}

export default App;
