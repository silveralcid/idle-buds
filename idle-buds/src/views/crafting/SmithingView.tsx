import React, { useState } from 'react';
import WorkbenchCard from '../../components/game/WorkbenchCard';
import { useGameStore } from '../../stores/game.store';
import { useHunterStore } from '../../stores/hunter.store';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useNodeAssignmentStore } from '../../stores/nodeAssignment.store';
import { workbenches } from '../../data/workbenches/workbench.data';

const SmithingView = () => {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  useGameLoop();

  const startCrafting = useGameStore((state) => state.startGathering); // We'll reuse gathering for now
  const smithingSkill = useHunterStore((state) => state.skills.smithing);
  const { assignments, assignBudToNode, removeBudFromNode } = useNodeAssignmentStore();
  const party = useHunterStore((state) => state.party);

  const handleActivate = (workbenchId: string) => {
    const currentActivity = useGameStore.getState().currentActivity;
    if (currentActivity !== workbenchId) {
      console.log(`Activating crafting for workbench: ${workbenchId}`);
      startCrafting(workbenchId, false);
    }
  };

  const handleRecipeSelect = (recipeId: string | null) => {
    setSelectedRecipeId(recipeId);
  };

  // Filter workbenches for smithing and smelting types
  const relevantWorkbenches = workbenches.filter(
    wb => wb.workbenchType === 'smithing' || wb.workbenchType === 'smelting'
  );

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Smithing</h2>
          <p className="text-sm opacity-70">
            Level: {smithingSkill.level} | XP: {smithingSkill.experience}/{smithingSkill.experienceToNextLevel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-grow overflow-auto">
        {relevantWorkbenches.map((workbench) => {
          const assignedBud = assignments[workbench.id];
          const assignedBudIds = assignedBud ? [assignedBud.id] : [];
          return (
            <WorkbenchCard
              key={workbench.id}
              workbench={workbench}
              assignedBuds={assignedBudIds}
              onAssignBud={(budId) => {
                const bud = party.find((b) => b.id === budId);
                if (bud) {
                  assignBudToNode(workbench.id, bud);
                }
              }}
              onRemoveBud={(budId) => removeBudFromNode(budId)}
              onActivate={handleActivate}
              skillId="smithing"
              selectedRecipeId={selectedRecipeId}
              onRecipeSelect={handleRecipeSelect}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SmithingView;