// src/components/GameContent.tsx
import { Routes, Route } from 'react-router-dom';
import WoodcuttingActivityPage from "./Activities/Gathering/Woodcutting/WoodcuttingActivityPage";
import CraftingActivityPage from "./Activities/Crafting/Crafting/CraftingActivityPage";
import DummyPage from "./DummyPage";

export const GameContent = () => {
  return (
    <div className="pt-12">
      <Routes>
        {/* Default route */}
        <Route path="/" element={<CraftingActivityPage />} />
        
        {/* Main sections */}
        <Route path="/store" element={<DummyPage title="Store" />} />
        <Route path="/inventory" element={<DummyPage title="Inventory" />} />
        <Route path="/bud-box" element={<DummyPage title="Bud Box" />} />
        
        {/* Combat routes */}
        <Route path="/level" element={<DummyPage title="Level" />} />
        <Route path="/attack" element={<DummyPage title="Attack" />} />
        <Route path="/defense" element={<DummyPage title="Defense" />} />
        <Route path="/health" element={<DummyPage title="Health" />} />
        <Route path="/efficiency" element={<DummyPage title="Efficiency" />} />

        {/* Passive routes */}
        <Route path="/farming" element={<DummyPage title="Farming" />} />
        
        {/* Non-Combat routes */}
        <Route path="/woodcutting" element={<WoodcuttingActivityPage />} />
        <Route path="/fishing" element={<DummyPage title="Fishing" />} />
        <Route path="/cooking" element={<DummyPage title="Cooking" />} />
        <Route path="/mining" element={<DummyPage title="Mining" />} />
        <Route path="/smithing" element={<DummyPage title="Smithing" />} />
        <Route path="/crafting" element={<CraftingActivityPage />} />

        {/* Other routes */}
        <Route path="/completion-log" element={<DummyPage title="Completion Log" />} />
        <Route path="/lore" element={<DummyPage title="Lore" />} />
        <Route path="/statistics" element={<DummyPage title="Statistics" />} />
        <Route path="/settings" element={<DummyPage title="Settings" />} />
        <Route path="/news" element={<DummyPage title="News & Changelog" />} />

        {/* Support routes */}
        <Route path="/bug-report" element={<DummyPage title="Report a Bug" />} />
        <Route path="/privacy" element={<DummyPage title="Privacy Policy" />} />
        
        {/* 404 route */}
        <Route path="*" element={<DummyPage title="Page Not Found" />} />
      </Routes>
    </div>
  );
};