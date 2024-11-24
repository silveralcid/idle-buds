import React from 'react';
import { useHunterStore } from '../stores/hunter.store';
import { useBankStore } from '../stores/bank.store';

const HunterInfo = () => {
  const skills = useHunterStore((state) => state.skills);
  const stats = useHunterStore((state) => state.stats);
  const items = useBankStore((state) => state.items);
  const hunterActivity = useHunterStore((state) => state.currentActivity);

  return (
    <div className="space-y-4">
      {/* Current Activity */}
      <div>
        <h3 className="font-bold text-lg mb-2">Current Activity</h3>
        <div className="bg-base-200 p-2 rounded-lg">
          <div className="capitalize">
            Hunter Activity: {hunterActivity ? hunterActivity.nodeId : 'None'}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div>
        <h3 className="font-bold text-lg mb-2">Stats</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(stats).map(([statName, value]) => (
            <div key={statName} className="flex justify-between">
              <span className="capitalize">{statName}:</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bank Section */}
      <div>
        <h3 className="font-bold text-lg mb-2">Bank</h3>
        <div className="space-y-1">
          {Object.entries(items).map(([itemName, amount]) => (
            <div key={itemName} className="flex justify-between items-center text-sm bg-base-200 p-2 rounded-lg">
              <span className="capitalize">{itemName}</span>
              <span>{amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <h3 className="font-bold text-lg mb-2">Skills</h3>
        <div className="space-y-2">
          {Object.entries(skills).map(([skillId, skill]) => (
            <div key={skillId} className="text-sm">
              <div className="flex justify-between items-center">
                <span className="capitalize">{skill.name}</span>
                <span>Lvl {skill.level}</span>
              </div>
              <progress
                className="progress progress-primary w-full h-1.5"
                value={skill.experience}
                max={skill.experienceToNextLevel}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HunterInfo;