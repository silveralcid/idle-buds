import React from "react";
import { useViewStore } from "../core/view.store";

const TestingView: React.FC = () => {
  const setView = useViewStore((state) => state.setView);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Testing View</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      </div>
    </div>
  );
};

export default TestingView;
