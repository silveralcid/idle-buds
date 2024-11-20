import React from 'react';

const HunterInfo = () => {
  return (
    <div className="space-y-4">
      {/* Stats Section */}
      <div>
        <h3 className="font-bold text-lg mb-2">Stats</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Health: 100</div>
          <div>Wisdom: 50</div>
          <div>Attack: 75</div>
          <div>Defense: 60</div>
          <div>Dexterity: 80</div>
          <div>Points: 10</div>
        </div>
      </div>

      {/* Resources Section */}
      <div>
        <h3 className="font-bold text-lg mb-2">Resources</h3>
        <div className="space-y-1">
          <div className="flex justify-between items-center text-sm bg-base-200 p-2 rounded-lg">
            <span className="capitalize">Resource Name</span>
            <div className="flex items-center gap-2">
              <span>100</span>
              <span className="loading loading-spinner loading-xs text-primary"/>
            </div>
          </div>
        </div>
      </div>

      {/* Current Activity */}
      <div>
        <h3 className="font-bold text-lg mb-2">Current Activity</h3>
        <div className="bg-base-200 p-2 rounded-lg">
          <div className="capitalize">Activity Type</div>
          <div className="text-sm opacity-70">
            Active: Yes
          </div>
          <div className="text-sm mt-1">
            Resources/tick: 5
          </div>
        </div>
      </div>

      {/* Activity Levels */}
      <div>
        <h3 className="font-bold text-lg mb-2">Skills</h3>
        <div className="space-y-2">
          <div className="text-sm">
            <div className="flex justify-between items-center">
              <span className="capitalize">Skill Name</span>
              <span>Lvl 10</span>
            </div>
            <progress 
              className="progress progress-primary w-full h-1.5" 
              value={50} 
              max={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HunterInfo;