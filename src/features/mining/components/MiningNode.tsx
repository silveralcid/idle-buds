import React from "react";
import { useMiningStore } from "../mining.store";
import { startMining, stopMining } from "../mining.logic";

interface MiningNodeProps {
  nodeId: string;
}

const MiningNode: React.FC<MiningNodeProps> = ({ nodeId }) => {
  const node = useMiningStore((state) => state.nodes[nodeId]);
  const currentNode = useMiningStore((state) => state.currentNode);

  if (!node) {
    return (
      <div className="p-4 bg-red-500 text-white rounded">
        <p>Node not found.</p>
      </div>
    );
  }

  const handleMine = () => startMining(nodeId);
  const handleStop = () => stopMining();

  const isMiningThisNode = currentNode === nodeId;
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
      ) : isMiningThisNode ? (
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={handleStop}
        >
          Stop Mining
        </button>
      ) : (
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={handleMine}
          disabled={node.nodeHealth <= 0}
        >
          {node.nodeHealth > 0 ? "Mine" : "Depleted"}
        </button>
      )}
    </div>
  );
};

export default MiningNode;
