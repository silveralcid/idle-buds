import ResourceCard from '../../components/game/ResourceCard';
import { useHunterStore } from '../../stores/hunter.store';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useActivityStore } from '../../stores/active-bud.store';
import { useHunterGathering } from '../../hooks/useHunterGathering';
import { useBudGathering } from '../../hooks/useBudGathering';
import { miningNodes } from '../../data/nodes/mining.data';

const MiningView = () => {
  useGameLoop();

  const miningSkill = useHunterStore((state) => state.skills.mining);
  const party = useHunterStore((state) => state.party);
  const budActivities = useActivityStore((state) => state.budActivities);
  const { startActivity, stopActivity } = useActivityStore();

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Mining</h2>
          <p className="text-sm opacity-70">
            Level: {miningSkill.level} | XP: {miningSkill.experience}/{miningSkill.experienceToNextLevel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-grow overflow-auto">
        {miningNodes.map((resource) => {
          // Find any bud assigned to this node
          const assignedBud = Object.values(budActivities).find(
            activity => activity.nodeId === resource.id
          );
          const assignedBudIds = assignedBud ? [assignedBud.budId] : [];
          
          const { startGathering: startHunterGathering } = useHunterGathering(
            resource.id,
            resource.isUnlocked
          );
          const { startGathering: startBudGathering, stopGathering: stopBudGathering } = 
            useBudGathering(resource.id, resource.isUnlocked);

          return (
            <ResourceCard
              key={resource.id}
              resource={resource}
              assignedBuds={assignedBudIds}
              onAssignBud={(budId) => {
                const bud = party.find((b) => b.id === budId);
                if (bud) {
                  startActivity('bud', {
                    type: 'gathering',
                    nodeId: resource.id,
                    budId: bud.id
                  });
                  startBudGathering(budId);
                }
              }}
              onRemoveBud={(budId) => {
                stopBudGathering(budId);
                stopActivity('bud', budId);
              }}
              onActivate={() => startHunterGathering()}
              skillId="mining"
            />
          );
        })}
      </div>
    </div>
  );
};

export default MiningView;