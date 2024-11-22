import ResourceCard from '../../components/game/ResourceCard';
import { useHunterStore } from '../../stores/hunter.store';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useActiveBudStore } from '../../stores/active-bud.store';
import { lumberingNodes } from '../../data/nodes/lumbering.data';
import { getBudParty } from '../../stores/active-bud.store';

const LumberingView = () => {
  useGameLoop();

  const lumberingSkill = useHunterStore((state) => state.skills.lumbering);
  const party = useActiveBudStore(getBudParty);
  const budActivities = useActiveBudStore((state) => state.budActivities);
  const startBudActivity = useActiveBudStore((state) => state.startBudActivity);
  const stopBudActivity = useActiveBudStore((state) => state.stopBudActivity);
  const startHunterActivity = useHunterStore((state) => state.startHunterActivity);

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
        {lumberingNodes.map((resource) => {
          // Find any bud assigned to this node
          const assignedBud = party.find(bud => 
            budActivities[bud.id]?.nodeId === resource.id
          );
          const assignedBudIds = assignedBud ? [assignedBud.id] : [];

          return (
            <ResourceCard
              key={resource.id}
              resource={resource}
              assignedBuds={assignedBudIds}
              onAssignBud={(budId) => {
                const bud = party.find((b) => b.id === budId);
                if (bud) {
                  startBudActivity(budId, 'gathering', resource.id);
                }
              }}
              onRemoveBud={(budId) => {
                stopBudActivity(budId);
              }}
              onActivate={() => startHunterActivity('gathering', resource.id)}
              skillId="lumbering"
            />
          );
        })}
      </div>
    </div>
  );
};

export default LumberingView;