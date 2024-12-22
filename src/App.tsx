import React, { useEffect } from "react";
import { useViewStore } from "./core/view.store";
import GameContainer from "./views/GameContainer";
import MiningView from "./views/MiningView";
import Sidebar from "./core/components/Sidebar";
import { ResumeModal } from "./core/components/ResumeModal";
import { VisibilityHandler } from "./core/components/VisibilityHandler";
import { initializeGame } from "./utils/initialize-game";
import SmithingView from "./views/SmithingView";
import LumberingView from "./views/LumberingView";
import TestingView from "./views/TestingView";
import BankView from "./views/BankView";
import BudBoxView from "./views/BudBoxView";
import TendingView from "./views/TendingView";
import ShopView from "./views/ShopView";
import AssignmentView from "./views/AssignmentView";
import CookingView from "./views/CookingView";
import FishingView from "./views/FishingView";
import CombatView from "./views/CombatView";

function App() {
  const currentView = useViewStore((state) => state.currentView);

  useEffect(() => {
    const cleanup = initializeGame();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const renderView = () => {
    switch (currentView) {
      case "MiningView":
        return <MiningView />;
      case "SmithingView":
        return <SmithingView />;
      case "LumberingView":
        return <LumberingView />;
      case "TestingView":
        return <TestingView />;
      case "FishingView":
        return <FishingView />;
      case "CookingView":
        return <CookingView />;
      case "CombatView":
        return <CombatView />;
      case "BankView":
        return <BankView />;
      case "BudBoxView":
        return <BudBoxView />;
      case "TendingView":
        return <TendingView />;
      case "ShopView":
        return <ShopView />;
      case "AssignmentView":
        return <AssignmentView />;
      default:
        return <div>No view found.</div>;
    }
  };

  return (
    <>
      <ResumeModal />
      <VisibilityHandler />
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 p-4 bg-base-300">
          <GameContainer>{renderView()}</GameContainer>
        </main>
      </div>
    </>
  );
}

export default App;
