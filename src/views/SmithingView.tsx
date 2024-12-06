import React from "react";
import { useSmithingStore } from "../features/smithing/smithing.store";
import SmithingWorkbench from "../features/smithing/components/SmithingWorkbench";

const SmithingView: React.FC = () => {
  const workbenches = useSmithingStore((state) => state.workbenches);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Smithing</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(workbenches).map((workbenchId) => (
          <SmithingWorkbench key={workbenchId} workbenchId={workbenchId} />
        ))}
      </div>
    </div>
  );
};

export default SmithingView;
