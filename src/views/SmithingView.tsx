import React from "react";
import SmeltingWorkbench from "../features/smithing/components/SmeltingWorkbench";

const SmithingView: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Smithing</h1>
      <SmeltingWorkbench />
    </div>
  );
};

export default SmithingView;
