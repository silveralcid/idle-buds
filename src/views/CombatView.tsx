import React from 'react';

const CombatView: React.FC = () => {
  return (
    <div className="w-full h-full p-4">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Combat View</h2>
          <p>This is a combat view.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Action</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombatView;