import React from 'react';
import ResourceCard from '../../components/game/ResourceCard';
import { woodResources } from '../../data/nodes/wood.data';
import { useGameStore } from '../../stores/game.store';
import { useHunterStore } from '../../stores/hunter.store';
import { useGameLoop } from '../../hooks/useGameLoop'; // Import the hook

const LumberingView = () => {
  useGameLoop(); // Call the hook to start the game loop

  const startGathering = useGameStore((state) => state.startGathering);
  const lumberingSkill = useHunterStore((state) => state.skills.lumbering);

  const handleActivate = (resourceId: string) => {
    const currentActivity = useGameStore.getState().currentActivity;
    if (currentActivity !== resourceId) {
      console.log(`Activating gathering for resource: ${resourceId}`);
      startGathering(resourceId, false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Lumbering</h2>
          <p className="text-sm opacity-70">
            Level: {lumberingSkill.level} | XP: {lumberingSkill.experience}/{lumberingSkill.experienceToNextLevel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-grow overflow-auto">
        {woodResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onActivate={handleActivate}
            skillId="lumbering"
          />
        ))}
      </div>
    </div>
  );
};

export default LumberingView;