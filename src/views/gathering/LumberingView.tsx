import ResourceCard from '../../components/game/ResourceCard';
import { useHunterStore } from '../../stores/hunter.store';
import { useGameLoop } from '../../hooks/useGameLoop';
import { lumberingNodes } from '../../data/nodes/lumbering.data';

const LumberingView = () => {
  useGameLoop();

  const lumberingSkill = useHunterStore((state) => state.skills.lumbering);
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
          return (
            <ResourceCard
              key={resource.id}
              resource={resource}
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