// src/components/GameContent.tsx
import { Routes, Route } from 'react-router-dom';
import WoodcuttingActivityPage from "./Activities/Gathering/Woodcutting/WoodcuttingActivityPage";
import CraftingActivityPage from "./Activities/Crafting/Crafting/CraftingActivityPage";
// Import other page components as needed

export const GameContent = () => {
  return (
    <div className="pt-12">
      <Routes>
        {/* Default route */}
        <Route path="/" element={<CraftingActivityPage />} />
        
        {/* Main sections */}
        <Route path="/store" element={<div>Store Page</div>} />
        <Route path="/inventory" element={<div>Inventory Page</div>} />
        <Route path="/bud-box" element={<div>Bud Box Page</div>} />
        
        {/* Non-Combat routes */}
        <Route path="/woodcutting" element={<WoodcuttingActivityPage />} />
        <Route path="/crafting" element={<CraftingActivityPage />} />
        
        {/* Add placeholder routes for other pages */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </div>
  );
};