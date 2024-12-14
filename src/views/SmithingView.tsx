import React from "react";
import SmeltingWorkbench from "../features/smithing/components/SmeltingWorkbench";
import SmithingWorkbench from "../features/smithing/components/SmithingWorkbench";

const SmithingView: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Smithing</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SmeltingWorkbench />
        <SmithingWorkbench />
      </div>
    </div>
  );
};

export default SmithingView;