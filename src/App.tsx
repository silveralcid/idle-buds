import React, { useEffect } from "react";
import { useViewStore } from "./stores/view.store";
import GameContainer from "./views/GameContainer";
import MiningView from "./views/gathering/MiningView";
import Sidebar from "./components/common/Sidebar"; // Import Sidebar
import { GameLoop } from "./core/game-loop/game-loop";

function App() {
  const currentView = useViewStore((state) => state.currentView);

  useEffect(() => {
    const gameLoop = GameLoop.getInstance();
    gameLoop.start();

    return () => {
      gameLoop.stop();
    };
  }, []);

  const renderView = () => {
    switch (currentView) {
      case "mining":
        return <MiningView />;
      default:
        return <div>Select a view to display.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-base-300">
      <Sidebar /> {/* Add Sidebar */}
      <div className="flex-1">
        <GameContainer>{renderView()}</GameContainer>
      </div>
    </div>
  );
}

export default App;
