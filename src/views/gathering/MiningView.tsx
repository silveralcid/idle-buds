import React from "react";
import ResourceNodeComponent from "../../components/game/ResourceNode"; // Import reusable component
import { miningNodes } from "../../data/nodes/mining.data"; // Import mining nodes data

const MiningView: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mining</h1>
      <p className="mb-6">Select a resource node to start gathering.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {miningNodes.map((node) => (
          <ResourceNodeComponent key={node.id} node={node} skillId="mining" />
        ))}
      </div>
    </div>
  );
};

export default MiningView;
