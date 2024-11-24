import ResourceCard from '../../components/game/ResourceCard';
import { useHunterStore } from '../../stores/hunter.store';
import { useGameLoop } from '../../hooks/useGameLoop';
import { miningNodes } from '../../data/nodes/mining.data';

const MiningView = () => {
  useGameLoop();

  const MiningSkill = useHunterStore((state) => state.skills.Mining);
  const startHunterActivity = useHunterStore((state) => state.startHunterActivity);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Mining</h2>
          <p className="text-sm opacity-70">
            Level: {MiningSkill.level} | XP: {MiningSkill.experience}/{MiningSkill.experienceToNextLevel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-grow overflow-auto">
        {miningNodes.map((resource) => {
          return (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onActivate={() => startHunterActivity('gathering', resource.id)}
              skillId="Mining"
            />
          );
        })}
      </div>
    </div>
  );
};

export default MiningView;