import ResourceCard from '../../components/game/ResourceCard';
import { useHunterStore } from '../../stores/hunter.store';
import { useGameLoop } from '../../hooks/useGameLoop';
import { miningNodes } from '../../data/nodes/mining.data';

const MiningView = () => {
  useGameLoop();

  const miningSkill = useHunterStore((state) => state.skills.mining);
  const startHunterGathering = useHunterStore((state) => state.startHunterGathering);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">mining</h2>
          <p className="text-sm opacity-70">
            Level: {miningSkill.level} | XP: {miningSkill.experience}/{miningSkill.experienceToNextLevel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-grow overflow-auto">
        {miningNodes.map((resource) => {
          return (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onActivate={() => startHunterGathering(resource.id)}
              skillId="mining"
            />
          );
        })}
      </div>
    </div>
  );
};

export default MiningView;