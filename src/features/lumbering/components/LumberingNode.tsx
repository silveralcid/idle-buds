import React from "react";
import { useLumberingStore } from "../lumbering.store";
import { startLumbering, stopLumbering } from "../lumbering.logic";

interface LumberingNodeProps {
  nodeId: string;
}

const LumberingNode: React.FC<LumberingNodeProps> = ({ nodeId }) => {
  const node = useLumberingStore((state) => state.nodes[nodeId]);
  const activeNode = useLumberingStore((state) => state.activeNode);

  if (!node) {
    return (
      <div className="p-4 bg-red-500 text-white rounded">
        <p>Node not found.</p>
      </div>
    );
  }
  const handleLumber = () => startLumbering(nodeId);
  const handleStop = () => stopLumbering();

  const isLumberingThisNode = activeNode === nodeId;
  const isLocked = !node.isUnlocked;

  return (
    <div
      className={`p-4 rounded shadow-md ${
        isLocked ? "bg-gray-300 text-gray-500" : "bg-gray-100"
      }`}
    >
      <h3 className="text-lg font-bold mb-2">{node.name}</h3>
      <p>
        Health: {node.nodeHealth.toFixed(2)} / {node.maxHealth.toFixed(2)} (
        {((node.nodeHealth / node.maxHealth) * 100).toFixed(0)}%)
      </p>
      <p>Level Required: {node.levelRequired}</p>
      <p>XP Gain: {node.experienceGain.toFixed(2)}</p>

      {isLocked ? (
        <p className="italic text-sm mt-4">Node is locked.</p>
      ) : isLumberingThisNode ? (
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={handleStop}
        >
          Stop Lumbering
        </button>
      ) : (
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          onClick={handleLumber}
          disabled={node.nodeHealth <= 0}
        >
          {node.nodeHealth > 0 ? "Chop" : "Depleted"}
        </button>
      )}
    </div>
  );
};

export default LumberingNode;
