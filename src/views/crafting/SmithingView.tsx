import React from "react";
import { useHunterStore } from "../../stores/hunter.store";

const SmithingView: React.FC = () => {
  const currentTask = useHunterStore((state) => state.currentTask);

  return (
    <div className="p-6 bg-gray-900 text-white rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Smithing</h1>
      <p className="mb-4">Welcome to the smithing area! Use a workbench to craft items and refine materials.</p>

      {/* Display Current Task */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Task</h2>
        {currentTask && currentTask.type === "crafting" ? (
          <div>
            <p>
              <strong>Task:</strong> {currentTask.taskId}
            </p>
            <p>
              <strong>Status:</strong> In Progress
            </p>
          </div>
        ) : (
          <p>No active smithing task.</p>
        )}
      </div>

      {/* Placeholder for Workbench Component */}
      <div className="bg-gray-800 p-4 rounded">
        <p className="text-center">Workbench will be implemented here.</p>
      </div>
    </div>
  );
};

export default SmithingView;
