import React from 'react';
import { useGameStore } from '../../stores/game.store';

interface OfflineProgressionModalProps {
  isVisible: boolean;
  onClose: () => void;
  progressionData: {
    hunterResources: Record<string, number>;
    budResources: Record<string, number>;
    hunterExperience: Record<string, number>;
    budExperience: Record<string, number>;
  };
  getItemName: (itemId: string) => string;
}

const OfflineProgressionModal: React.FC<OfflineProgressionModalProps> = ({ isVisible, onClose, progressionData, getItemName }) => {
  const lastSaveTime = useGameStore((state) => state.lastSaveTime);
  
  if (!isVisible) return null;

  const saveDate = new Date(lastSaveTime);
  const formattedDate = saveDate.toLocaleString();

  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - saveDate.getTime();

  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  // Ensure progressionData properties exist with default empty objects
  const {
    hunterResources = {},
    budResources = {},
    hunterExperience = {},
    budExperience = {}
  } = progressionData;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Welcome Back!</h3>
        <p className="py-4">Last saved on: {formattedDate}</p>
        <p className="py-2">You were gone for: {hours} hours, {minutes} minutes, and {seconds} seconds.</p>
        
        {Object.keys(hunterResources).length > 0 && (
          <div className="py-2">
            <h4 className="font-bold">Hunter Resources Gained:</h4>
            <ul>
              {Object.entries(hunterResources).map(([itemId, amount]) => (
                <li key={itemId}>{getItemName(itemId)}: {amount}</li>
              ))}
            </ul>
          </div>
        )}

        {Object.keys(budResources).length > 0 && (
          <div className="py-2">
            <h4 className="font-bold">Bud Resources Gained:</h4>
            <ul>
              {Object.entries(budResources).map(([itemId, amount]) => (
                <li key={itemId}>{getItemName(itemId)}: {amount}</li>
              ))}
            </ul>
          </div>
        )}

        {Object.keys(hunterExperience).length > 0 && (
          <div className="py-2">
            <h4 className="font-bold">Hunter Experience Gained:</h4>
            <ul>
              {Object.entries(hunterExperience).map(([skill, xp]) => (
                <li key={skill}>{skill}: {xp} XP</li>
              ))}
            </ul>
          </div>
        )}

        {Object.keys(budExperience).length > 0 && (
          <div className="py-2">
            <h4 className="font-bold">Bud Experience Gained:</h4>
            <ul>
              {Object.entries(budExperience).map(([bud, xp]) => (
                <li key={bud}>{bud}: {xp} XP</li>
              ))}
            </ul>
          </div>
        )}

        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default OfflineProgressionModal;