import React from "react";
import { useHunterStore } from "../../stores/hunter.store";
import { ResourceNode } from "../../types/resource-node.types";

interface ResourceNodeProps {
  node: ResourceNode; // The resource node to display
  skillId: string; // The skill ID required for this node
}

const ResourceNodeComponent: React.FC<ResourceNodeProps> = ({ node, skillId }) => {
  const startTask = useHunterStore((state) => state.startTask);
  const currentTask = useHunterStore((state) => state.currentTask);
  const hunterSkills = useHunterStore((state) => state.hunterSkills);

  const skill = hunterSkills[skillId];
  const canGather = skill && skill.level >= node.levelRequired;

  const handleGatherClick = () => {
    if (!canGather) {
      alert(`You need at least level ${node.levelRequired} in ${skill?.name || "this skill"} to gather.`);
      return;
    }
  
    if (currentTask?.taskId === node.id) {
      alert("Already gathering from this node!");
      return;
    }
  
    startTask({
      taskId: node.id,
      type: "gathering",
      skillId,
    });
  };
  

  return (
    <div className="p-4 bg-gray-800 text-white rounded shadow-md">
      <h3 className="text-lg font-bold">{node.name}</h3>
      <p>Required Level: {node.levelRequired}</p>
      <p>Experience Gain: {node.experienceGain}</p>
      <p>Yields: {node.resourceNodeYields.join(", ")}</p>
      <p>Health: {node.nodeHealth}/{node.maxHealth}</p>
      <button
        onClick={handleGatherClick}
        className={`mt-2 px-4 py-2 rounded ${
          canGather ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 cursor-not-allowed"
        }`}
        disabled={!canGather || currentTask?.taskId === node.id}
      >
        {currentTask?.taskId === node.id ? "Gathering..." : canGather ? "Gather" : "Can't Gather"}
      </button>
    </div>
  );
};

export default ResourceNodeComponent;
