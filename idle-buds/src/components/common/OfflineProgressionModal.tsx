import React, { useState, useEffect } from 'react';

interface OfflineProgressionModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const OfflineProgressionModal: React.FC<OfflineProgressionModalProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Welcome Back!</h3>
        <p className="py-4">While you were away, your Buds have been busy gathering resources and gaining experience.</p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default OfflineProgressionModal;