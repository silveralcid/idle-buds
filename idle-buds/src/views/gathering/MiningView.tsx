import React from 'react';

const MiningView = () => {
  return (
    <div className="h-full flex flex-col gap-4">
      {/* Activity Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Lumbering</h2>
          <p className="text-sm opacity-70">Level: 1 | XP: 0/100</p>
        </div>
        <div className="badge badge-primary">Active</div>
      </div>

      {/* Resource Nodes */}
      <div className="grid grid-cols-2 gap-4">
        {/* Tier 1 Wood Node */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Tier 1 Wood</h3>
            <div className="space-y-2">
              <progress 
                className="progress progress-primary w-full" 
                value={40} 
                max={100}
              />
              <div className="flex justify-between text-sm">
                <span>Resources/hr: 20</span>
                <span>Level Required: 1</span>
              </div>
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm">
                  Start Gathering
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 2 Wood Node - Locked */}
        <div className="card bg-base-200 shadow-lg opacity-50">
          <div className="card-body">
            <h3 className="card-title">
              Tier 2 Wood
              <div className="badge badge-secondary">Locked</div>
            </h3>
            <div className="space-y-2">
              <progress 
                className="progress progress-secondary w-full" 
                value={0} 
                max={100}
              />
              <div className="flex justify-between text-sm">
                <span>Resources/hr: 40</span>
                <span>Level Required: 15</span>
              </div>
              <div className="card-actions justify-end">
                <button className="btn btn-secondary btn-sm" disabled>
                  Unlock at Level 15
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Gatherers */}
      <div className="card bg-base-200 shadow-lg mt-auto">
        <div className="card-body">
          <h3 className="card-title">Active Gatherers</h3>
          <div className="divide-y divide-base-300">
            <div className="py-2 flex justify-between items-center">
              <div>
                <p className="font-semibold">Hunter</p>
                <p className="text-sm opacity-70">Gathering Tier 1 Wood</p>
              </div>
              <button className="btn btn-error btn-sm">Stop</button>
            </div>
            <div className="py-2 flex justify-between items-center">
              <div>
                <p className="font-semibold">Forest Bud</p>
                <p className="text-sm opacity-70">Gathering Tier 1 Wood</p>
              </div>
              <button className="btn btn-error btn-sm">Stop</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiningView;
