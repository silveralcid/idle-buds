import React from "react";
import SmeltingWorkbench from "../features/smithing/components/SmeltingWorkbench";

const SmithingView: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Smithing</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SmeltingWorkbench />
        {/* We'll add SmithingWorkbench here later */}
      </div>
    </div>
  );
};

export default SmithingView;