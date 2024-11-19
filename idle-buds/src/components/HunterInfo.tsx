import React from 'react';
import { useHunterStore } from '../stores/hunter.store';
import { ActivityType } from '../enums/activity.enums';

const HunterInfo = () => {
  const { stats, activityLevels, currentActivity } = useHunterStore();

  return (
    <div className="space-y-4">
      {/* Stats Section */}
      <div>
        <h3 className="font-bold text-lg mb-2">Stats</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Health: {stats.health}</div>
          <div>Wisdom: {stats.wisdom}</div>
          <div>Attack: {stats.attack}</div>
          <div>Defense: {stats.defense}</div>
          <div>Dexterity: {stats.dexterity}</div>
          <div>Points: {stats.attributePoints}</div>
        </div>
      </div>

      {/* Current Activity */}
      {currentActivity && (
        <div>
          <h3 className="font-bold text-lg mb-2">Current Activity</h3>
          <div className="bg-base-200 p-2 rounded-lg">
            <div>{currentActivity.type}</div>
            <div className="text-sm opacity-70">
              Active: {currentActivity.isActive ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      )}

      {/* Activity Levels */}
      <div>
        <h3 className="font-bold text-lg mb-2">Skills</h3>
        <div className="space-y-2">
          {Object.entries(activityLevels).map(([activity, info]) => (
            <div key={activity} className="text-sm">
              <div className="flex justify-between items-center">
                <span className="capitalize">{activity}</span>
                <span>Lvl {info.level}</span>
              </div>
              <progress 
                className="progress progress-primary w-full h-1.5" 
                value={info.currentXp} 
                max={info.requiredXp}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HunterInfo;
