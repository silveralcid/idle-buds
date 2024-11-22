import ResourceCard from '../../components/game/ResourceCard';
import { useHunterStore } from '../../stores/hunter.store';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useActivityStore } from '../../stores/active-bud.store';
import { lumberingNodes } from '../../data/nodes/lumbering.data';
import { useHunterGathering } from '../../hooks/useHunterGathering';
import { useBudGathering } from '../../hooks/useBudGathering';
import { useBudStore } from '../../stores/box-bud.store';
import { getParty } from '../../stores/box-bud.store';

const LumberingView = () => {
  useGameLoop();

  const lumberingSkill = useHunterStore((state) => state.skills.lumbering);
  const party = useBudStore(getParty);
  const budActivities = useActivityStore((state) => state.budActivities);
  const startActivity = useActivityStore((state) => state.startActivity);

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
          const assignedBudId = Object.entries(budActivities).find(
            ([budId, activity]) => activity.nodeId === resource.id
          )?.[0];

          const assignedBud = assignedBudId ? party.find(bud => bud.id === assignedBudId) : null;
          const assignedBudIds = assignedBud ? [assignedBud.id] : [];

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
                  const success = startBudGathering(budId);
                  if (success) {
                    startActivity('bud', {
                      type: 'gathering',
                      nodeId: resource.id,
                      budId: bud.id
                    });
                  }
                }
              }}
              onRemoveBud={(budId) => {
                stopBudGathering(budId);
              }}
              onActivate={() => startHunterGathering()}
              skillId="lumbering"
            />
          );
        })}
      </div>
    </div>
  );
};

export default LumberingView;