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
}

const OfflineProgressionModal: React.FC<OfflineProgressionModalProps> = ({ isVisible, onClose, progressionData }) => {
  const lastSaveTime = useGameStore((state) => state.lastSaveTime);
  
  console.log('Modal visibility:', isVisible);
  console.log('Progression data in modal:', progressionData);

  if (!isVisible) return null;

  const saveDate = new Date(lastSaveTime);
  const formattedDate = saveDate.toLocaleString();

  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - saveDate.getTime();

  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Welcome Back!</h3>
        <p className="py-4">Last saved on: {formattedDate}</p>
        <p className="py-2">You were gone for: {hours} hours, {minutes} minutes, and {seconds} seconds.</p>
        <p className="py-2">While you were away, your Buds have been busy gathering resources and gaining experience.</p>
        
        <div className="py-2">
          <h4 className="font-bold">Hunter Resources Gained:</h4>
          <ul>
            {Object.entries(progressionData.hunterResources).map(([resource, amount]) => (
              <li key={resource}>{resource}: {amount}</li>
            ))}
          </ul>
        </div>

        <div className="py-2">
          <h4 className="font-bold">Bud Resources Gained:</h4>
          <ul>
            {Object.entries(progressionData.budResources).map(([resource, amount]) => (
              <li key={resource}>{resource}: {amount}</li>
            ))}
          </ul>
        </div>

        <div className="py-2">
          <h4 className="font-bold">Hunter Experience Gained:</h4>
          <ul>
            {Object.entries(progressionData.hunterExperience).map(([skill, xp]) => (
              <li key={skill}>{skill}: {xp} XP</li>
            ))}
          </ul>
        </div>

        <div className="py-2">
          <h4 className="font-bold">Bud Experience Gained:</h4>
          <ul>
            {Object.entries(progressionData.budExperience).map(([bud, xp]) => (
              <li key={bud}>{bud}: {xp} XP</li>
            ))}
          </ul>
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default OfflineProgressionModal;