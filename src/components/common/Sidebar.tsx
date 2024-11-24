import React from "react";
import { useHunterStore } from "../../stores/hunter.store";
import { useBankStore } from "../../stores/bank.store";
import { useViewStore } from "../../stores/view.store";

const Sidebar: React.FC = () => {
  const hunterSkills = useHunterStore((state) => state.hunterSkills);
  const currentTask = useHunterStore((state) => state.currentTask);
  const bankItems = useBankStore((state) => state.items);
  const setView = useViewStore((state) => state.setView);

  const handleSkillClick = (skillId: string) => {
    setView(skillId.toLowerCase()); // Dynamically set the view based on the skill ID
  };

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-lg font-bold mb-4">Idle Buds</h2>

      {/* Skill Progress */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Skills</h3>
        <ul>
          {Object.values(hunterSkills).map((skill) => (
            <li
              key={skill.id}
              className="mb-2 cursor-pointer hover:bg-gray-700 p-2 rounded"
              onClick={() => handleSkillClick(skill.id)} // Click handler to change view
            >
              <div className="flex justify-between items-center">
                <span>{skill.name}</span>
                <span>
                  Lv. {skill.level} ({skill.experience}/{skill.experienceToNextLevel} XP)
                </span>
              </div>
              <div className="h-2 bg-gray-600 rounded mt-1">
                <div
                  className="h-full bg-green-500 rounded"
                  style={{
                    width: `${(skill.experience / skill.experienceToNextLevel) * 100}%`,
                  }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Current Task */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Current Task</h3>
        {currentTask ? (
          <div>
            <p>
              <strong>Task:</strong> {currentTask.taskId}
            </p>
            <p>
              <strong>Type:</strong> {currentTask.type}
            </p>
          </div>
        ) : (
          <p>No active task</p>
        )}
      </div>

      {/* Bank Items */}
      <div>
        <h3 className="text-md font-semibold mb-2">Bank Items</h3>
        <ul>
          {Object.entries(bankItems).map(([itemId, quantity]) => (
            <li key={itemId}>
              {itemId}: {quantity}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
