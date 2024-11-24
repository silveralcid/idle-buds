import React from "react";
import ResourceNodeComponent from "../../components/game/ResourceNode"; // Reuse ResourceNodeComponent
import { lumberingNodes } from "../../data/nodes/lumbering.data"; // Import lumbering nodes data

const LumberingView: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lumbering</h1>
      <p className="mb-6">Select a tree to start gathering wood.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lumberingNodes.map((node) => (
          <ResourceNodeComponent key={node.id} node={node} skillId="lumbering" />
        ))}
      </div>
    </div>
  );
};

export default LumberingView;
