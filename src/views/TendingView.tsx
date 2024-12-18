import React from "react";

const TendingView: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tending View</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Content will go here */}
        <div className="p-4 bg-base-200 rounded-lg">
          <p>Tending functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default TendingView;
