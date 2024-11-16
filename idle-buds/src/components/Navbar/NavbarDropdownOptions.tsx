import React from 'react';
import { useGameStore } from '../../stores/useStore';

interface NavbarDropdownOptionsProps {
  playerName: string;
}

const NavbarDropdownOptions: React.FC<NavbarDropdownOptionsProps> = ({ playerName }) => {
  const { saveGame, loadGame, resetGame } = useGameStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = () => {
    saveGame();
    // Optional: Show toast or notification
    alert('Game saved successfully!');
  };

  const handleLoad = () => {
    loadGame();
    // Optional: Show toast or notification
    alert('Game loaded successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your game? This cannot be undone.')) {
      resetGame();
      // Optional: Show toast or notification
      alert('Game reset successfully!');
    }
  };

  const handleExportSave = () => {
    try {
      const saveData = localStorage.getItem('idle_buds_save');
      if (!saveData) {
        alert('No save data found!');
        return;
      }

      // Create blob and download
      const blob = new Blob([saveData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `idle-buds-save-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export save:', error);
      alert('Failed to export save!');
    }
  };

  const handleImportSave = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const saveData = JSON.parse(e.target?.result as string);
          
          // Store the save data
          localStorage.setItem('idle_buds_save', JSON.stringify(saveData));
          
          // Load the save data
          loadGame();
          
          // Optional: Show success message
          alert('Save imported successfully!');
        } catch (error) {
          console.error('Failed to parse save file:', error);
          alert('Invalid save file!');
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Failed to import save:', error);
      alert('Failed to import save!');
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className="dropdown dropdown-end dropdown-bottom">
      <div tabIndex={0} role="button" className="btn btn-outline">
        {playerName}
      </div>
      <ul 
        tabIndex={0} 
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-64"
      >
        {/* Account Section */}
        <li className="menu-title">
          <span>Account</span>
        </li>
        <li>
          <a>Logged in as: {playerName}</a>
        </li>
        <li>
          <a>Change Password</a>
        </li>
        <li>
          <a>Logout</a>
        </li>

        <div className="divider my-1"></div>

        {/* Save Management Section */}
        <li className="menu-title">
          <span>Save Management</span>
        </li>
        <li>
          <a onClick={handleSave}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Game
          </a>
        </li>
        <li>
          <a onClick={handleLoad}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Load Game
          </a>
        </li>
        <li>
          <a onClick={handleExportSave}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Save
          </a>
        </li>
        <li>
          <a onClick={triggerFileInput}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import Save
          </a>
        </li>
        <li>
          <a onClick={handleReset} className="text-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Reset Game
          </a>
        </li>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportSave}
          accept=".json"
          style={{ display: 'none' }}
        />      

        <div className="divider my-1"></div>

        {/* Actions Section */}
        <li className="menu-title">
          <span>Actions</span>
        </li>
        <li>
          <a>Change Character Name</a>
        </li>
        <li>
          <a>Select Character</a>
        </li>
      </ul>
    </div>
  );
};

export default NavbarDropdownOptions;
