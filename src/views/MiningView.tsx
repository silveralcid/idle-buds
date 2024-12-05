import React from "react";
import { useViewStore } from "../core/view.store";
import MiningNode from "../features/mining/components/MiningNode";
import { useMiningStore } from "../features/mining/mining.store";

const MiningView: React.FC = () => {
  const setView = useViewStore((state) => state.setView);
  const nodes = useMiningStore((state) => state.nodes); // Access all nodes from the mining state

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mining View</h1>
      <p>Click on a node to start mining!</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(nodes).map((node) => (
          <MiningNode key={node.id} nodeId={node.id} />
        ))}
      </div>
    </div>
  );
};

export default MiningView;
