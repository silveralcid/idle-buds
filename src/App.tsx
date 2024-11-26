import React from "react";
import { useViewStore } from "./core/view.state";
import GameContainer from "./views/GameContainer";
import MiningView from "./views/MiningView";
import Sidebar from "./core/components/Sidebar";

function App() {
  const currentView = useViewStore((state) => state.currentView);

  const renderView = () => {
    switch (currentView) {
      case "MiningView":
        return <MiningView />;
      default:
        return <div>No view found.</div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 bg-gray-100">
        <GameContainer>{renderView()}</GameContainer>
      </main>
    </div>
  );
}

export default App;
