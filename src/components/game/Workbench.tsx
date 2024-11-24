import React from "react";
import { useHunterStore } from "../../stores/hunter.store";
import { Workbench } from "../../types/workbench.types";

interface WorkbenchProps {
  workbench: Workbench; // The workbench to interact with
  skillId: string; // The skill ID required for crafting at this workbench
}

const WorkbenchComponent: React.FC<WorkbenchProps> = ({ workbench, skillId }) => {
  const startTask = useHunterStore((state) => state.startTask);
  const stopTask = useHunterStore((state) => state.stopTask);
  const currentTask = useHunterStore((state) => state.currentTask);
  const hunterSkills = useHunterStore((state) => state.hunterSkills);

  const skill = hunterSkills[skillId];
  const canCraft = skill && skill.level >= workbench.levelRequired;

  const handleCraftClick = () => {
    if (!canCraft) {
      alert(`You need at least level ${workbench.levelRequired} in ${skill?.name || "this skill"} to craft here.`);
      return;
    }

    if (currentTask?.taskId === workbench.id) {
      stopTask(); // Toggle off crafting if already crafting at this workbench
      return;
    }

    startTask({
      taskId: workbench.id,
      type: "crafting",
      skillId,
    });
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded shadow-md">
      <h3 className="text-lg font-bold">{workbench.name}</h3>
      <p>{workbench.description}</p>
      <p>Required Level: {workbench.levelRequired}</p>
      {workbench.tier && <p>Tier: {workbench.tier}</p>}
      {workbench.specialRequirements && workbench.specialRequirements.length > 0 && (
        <div>
          <p>Special Requirements:</p>
          <ul className="list-disc pl-6">
            {workbench.specialRequirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={handleCraftClick}
        className={`mt-2 px-4 py-2 rounded ${
          canCraft ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 cursor-not-allowed"
        }`}
        disabled={!canCraft}
      >
        {currentTask?.taskId === workbench.id ? "Stop Crafting" : "Start Crafting"}
      </button>
    </div>
  );
};

export default WorkbenchComponent;
