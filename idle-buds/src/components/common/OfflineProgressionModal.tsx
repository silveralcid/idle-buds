import React from 'react';

interface OfflineProgressionModalProps {
  isOpen: boolean;
  onClose: () => void;
  offlineDuration: number;
  resourcesGained: Record<string, number>;
  hunterXPGained: number;
  budXPGained: Record<string, number>;
}

const OfflineProgressionModal: React.FC<OfflineProgressionModalProps> = ({
  isOpen,
  onClose,
  offlineDuration,
  resourcesGained,
  hunterXPGained,
  budXPGained,
}) => {
  if (!isOpen) return null;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Welcome Back!</h2>
        <p>You were gone for {formatDuration(offlineDuration)}.</p>
        <h3 className="font-bold mt-4">Resources Gained:</h3>
        <ul>
          {Object.entries(resourcesGained).map(([resource, amount]) => (
            <li key={resource}>{resource}: {amount}</li>
          ))}
        </ul>
        <h3 className="font-bold mt-4">Experience Gained:</h3>
        <p>Hunter XP: {hunterXPGained}</p>
        <ul>
          {Object.entries(budXPGained).map(([bud, xp]) => (
            <li key={bud}>{bud}: {xp} XP</li>
          ))}
        </ul>
        <button onClick={onClose} className="mt-4 btn btn-primary">Close</button>
      </div>
    </div>
  );
};

export default OfflineProgressionModal;
