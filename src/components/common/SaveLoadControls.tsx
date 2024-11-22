import React, { useRef, useState } from 'react';
import { useGameStore } from '../../stores/game.store';
import { exportSave, importSave } from '../../utils/save-management.utils';

const SaveLoadControls = () => {
  const saveGame = useGameStore((state) => state.saveGame);
  const loadGame = useGameStore((state) => state.loadGame);
  const resetGame = useGameStore((state) => state.resetGame);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importSave(file);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="dropdown">
      <button className="btn" onClick={toggleDropdown}>Save/Load Options</button>
      {isDropdownOpen && (
        <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          <li><button onClick={saveGame}>Save Game</button></li>
          <li><button onClick={loadGame}>Load Game</button></li>
          <li><button onClick={resetGame}>Reset Game</button></li>
          <li><button onClick={exportSave}>Export Save</button></li>
          <li><button onClick={handleImportClick}>Import Save</button></li>
        </ul>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default SaveLoadControls;