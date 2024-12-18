import React from "react";
import Hatchery from "../features/tending/components/Hatchery";

const TendingView: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tending</h1>
      <div className="grid grid-cols-1 gap-4">
        <Hatchery />
      </div>
    </div>
  );
};

export default TendingView;
