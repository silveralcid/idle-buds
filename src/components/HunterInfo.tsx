import React from 'react';
import { useHunterStore, type HunterState, type HunterActions } from '../stores/hunter.store';
import { useBankStore } from '../stores/bank.store';

// Define the combined store type
type BankStore = {
  items: Record<string, number>;
};

const HunterInfo: React.FC = () => {
  const skills = useHunterStore((state: HunterState) => state.skills);
  const stats = useHunterStore((state: HunterState) => state.stats);
  const items = useBankStore((state: BankStore) => state.items);
  const hunterActivity = useHunterStore((state: HunterState) => state.currentHunterActivity);

  const getActivityDisplay = () => {
    if (!hunterActivity) return 'None';
    
    if (hunterActivity.type === 'gathering') {
      return `Gathering at ${hunterActivity.nodeId}`;
    }
    
    if (hunterActivity.type === 'crafting') {
      return `Crafting at ${hunterActivity.workbenchId}${
        hunterActivity.recipeId ? ` (Recipe: ${hunterActivity.recipeId})` : ''
      }`;
    }

    return 'Unknown Activity';
  };

  return (
    <div className="space-y-4">
      {/* Current Activity */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-lg">Current Activity</h3>
          <div className="bg-base-200 p-2 rounded-lg">
            <div className="capitalize">
              {getActivityDisplay()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-lg">Stats</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(stats).map(([statName, value]) => (
              <div 
                key={statName} 
                className="flex justify-between bg-base-200 p-2 rounded-lg"
              >
                <span className="capitalize">{statName}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bank Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-lg">Bank</h3>
          <div className="space-y-1">
            {Object.entries(items).map(([itemName, amount]) => (
              <div 
                key={itemName} 
                className="flex justify-between items-center text-sm bg-base-200 p-2 rounded-lg"
              >
                <span className="capitalize">{itemName}</span>
                <span>{amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-lg">Skills</h3>
          <div className="space-y-2">
            {Object.entries(skills).map(([skillId, skill]) => (
              <div key={skillId} className="text-sm">
                <div className="flex justify-between items-center">
                  <span className="capitalize">{skill.name}</span>
                  <span>Lvl {skill.level}</span>
                </div>
                <div className="relative pt-1">
                  <progress 
                    className="progress progress-primary w-full h-1.5"
                    value={skill.experience} 
                    max={skill.experienceToNextLevel}
                  />
                  <div className="text-xs text-center mt-1">
                    {skill.experience} / {skill.experienceToNextLevel}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HunterInfo;