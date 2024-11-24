import React, { useState, useEffect } from "react";
import { useHunterStore } from "../../stores/hunter.store";
import { useBankStore } from "../../stores/bank.store";
import { useViewStore } from "../../stores/view.store";
import { useGameStore } from "../../stores/game.store";
import { GameEvents } from "../../core/game-events/game-events";

const Sidebar: React.FC = () => {
  const [isSaveDropdownOpen, setSaveDropdownOpen] = useState(false);
  const hunterSkills = useHunterStore((state) => state.hunterSkills);
  const currentTask = useHunterStore((state) => state.currentTask);
  const bankItems = useBankStore((state) => state.items);
  const setView = useViewStore((state) => state.setView);
  const { saveGame, loadGame, resetGame, togglePause, isPaused, exportSave, importSave } = useGameStore();
  const gameEvents = GameEvents.getInstance();

  useEffect(() => {
    // Debugging: Log pause/unpause events
    gameEvents.on("gamePaused", () => console.log("Game has been paused."));
    gameEvents.on("gameResumed", () => console.log("Game has been resumed."));

    return () => {
      gameEvents.off("gamePaused", () => console.log("Game has been paused."));
      gameEvents.off("gameResumed", () => console.log("Game has been resumed."));
    };
  }, [gameEvents]);

  const handleSkillClick = (skillId: string) => {
    setView(skillId.toLowerCase());
  };

  const handleImportSave = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const saveData = reader.result as string;
          importSave(saveData); // Call importSave from the store
          alert("Save imported successfully!");
        } catch (error) {
          alert("Invalid save file. Please ensure the file format is correct.");
          console.error("Error importing save:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleTogglePause = () => {
    togglePause();
    if (isPaused) {
      gameEvents.emit("gameResumed");
    } else {
      gameEvents.emit("gamePaused");
    }
  };

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-lg font-bold mb-4">Idle Buds</h2>

      {/* Save Management */}
      <div className="mb-6">
        <h3
          className="text-md font-semibold mb-2 cursor-pointer hover:text-gray-300"
          onClick={() => setSaveDropdownOpen(!isSaveDropdownOpen)}
        >
          Save Management
        </h3>
        {isSaveDropdownOpen && (
          <ul className="bg-gray-700 rounded p-2">
            <li className="cursor-pointer hover:bg-gray-600 p-2 rounded" onClick={saveGame}>
              Save Game
            </li>
            <li className="cursor-pointer hover:bg-gray-600 p-2 rounded" onClick={() => loadGame()}>
              Load Game
            </li>
            <li className="cursor-pointer hover:bg-gray-600 p-2 rounded" onClick={exportSave}>
              Export Save
            </li>
            <li className="cursor-pointer hover:bg-gray-600 p-2 rounded">
              <label>
                Import Save
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleImportSave}
                  className="hidden"
                />
              </label>
            </li>
            <li
              className="cursor-pointer hover:bg-gray-600 p-2 rounded"
              onClick={() => {
                if (window.confirm("Are you sure you want to reset the game?")) {
                  resetGame();
                  alert("Game reset successfully!");
                }
              }}
            >
              Reset Game
            </li>
            <li className="cursor-pointer hover:bg-gray-600 p-2 rounded" onClick={handleTogglePause}>
              {isPaused ? "Unpause Game" : "Pause Game"}
            </li>
          </ul>
        )}
      </div>

      {/* Skill Progress */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Skills</h3>
        <ul>
          {Object.values(hunterSkills).map((skill) => (
            <li
              key={skill.id}
              className="mb-2 cursor-pointer hover:bg-gray-700 p-2 rounded"
              onClick={() => handleSkillClick(skill.id)}
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
