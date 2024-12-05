import React from "react";
import { useViewStore } from "../core/view.store";
import LumberingNode from "../features/lumbering/components/LumberingNode";
import { useLumberingStore } from "../features/lumbering/lumbering.store";

const LumberingView: React.FC = () => {
  const setView = useViewStore((state) => state.setView);
  const nodes = useLumberingStore((state) => state.nodes); // Access all nodes from the lumbering state

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lumbering View</h1>
      <p>Click on a node to start lumbering!</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(nodes).map((node) => (
          <LumberingNode key={node.id} nodeId={node.id} />
        ))}
      </div>
    </div>
  );
};

export default LumberingView;
