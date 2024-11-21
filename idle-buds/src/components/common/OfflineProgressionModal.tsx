import React from 'react';
import { useGameStore } from '../../stores/game.store';

interface OfflineProgressionModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const OfflineProgressionModal: React.FC<OfflineProgressionModalProps> = ({ isVisible, onClose }) => {
  const lastSaveTime = useGameStore((state) => state.lastSaveTime);
  
  if (!isVisible) return null;

  const saveDate = new Date(lastSaveTime);
  const formattedDate = saveDate.toLocaleString();

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Welcome Back!</h3>
        <p className="py-4">Last saved on: {formattedDate}</p>
        <p className="py-2">While you were away, your Buds have been busy gathering resources and gaining experience.</p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default OfflineProgressionModal;