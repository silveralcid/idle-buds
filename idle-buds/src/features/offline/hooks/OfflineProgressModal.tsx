// src/components/OfflineProgressModal.tsx
import React from 'react';

interface OfflineProgressProps {
  offlineTime: number;
  progress: {
    woodcutting: {
      experience: number;
      resources: {
        wood: number;
      };
    };
    // Add other activities
  };
  onClose: () => void;
}

export const OfflineProgressModal: React.FC<OfflineProgressProps> = ({
  offlineTime,
  progress,
  onClose
}) => {
  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);
    
    return parts.join(' ') || '0s';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Welcome Back!</h2>
        <p>You were away for {formatTime(offlineTime)}</p>
        
        <div className="my-4">
          <h3 className="font-semibold">While you were away:</h3>
          <div className="mt-2 space-y-2">
            {progress.woodcutting && (
              <div className="border-b pb-2">
                <h4 className="font-medium">Woodcutting</h4>
                <ul className="ml-4">
                  <li>Experience: +{Math.floor(progress.woodcutting.experience)}</li>
                  <li>Wood: +{Math.floor(progress.woodcutting.resources.wood)}</li>
                </ul>
              </div>
            )}
            {/* Add other activities here */}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Claim Rewards
        </button>
      </div>
    </div>
  );
};
