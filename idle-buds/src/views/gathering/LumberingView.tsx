import React from 'react';

const LumberingView = () => {
  return (
    <div className="h-full flex flex-col gap-4">
      {/* Activity Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Lumbering</h2>
          <p className="text-sm opacity-70">Level: -- | XP: --/--</p>
        </div>
        <div className="badge badge-primary">Active</div>
      </div>

      {/* Resource Nodes */}
      <div className="grid grid-cols-2 gap-4 flex-grow overflow-auto">
        {[1, 2, 3, 4].map((_, index) => (
          <div 
            key={index} 
            className="card bg-base-200 shadow-lg opacity-50"
          >
            <div className="card-body">
              <h3 className="card-title flex justify-between">
                Region Name
                <div className="badge badge-secondary">Locked</div>
              </h3>
              <div className="space-y-2">
                <progress 
                  className="progress progress-primary w-full" 
                  value={50} 
                  max={100}
                />
                <div className="flex justify-between text-sm">
                  <span>Resources/hr: --</span>
                  <span>Level Required: --</span>
                </div>
                <div className="card-actions justify-end">
                  <button className="btn btn-secondary btn-sm" disabled>
                    Unlock at Level --
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LumberingView;