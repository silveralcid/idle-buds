// src/components/OfflineProgressModal.tsx
import React from 'react';

interface ResourceProgress {
  [resourceName: string]: number;
}

interface ActivityProgress {
  experience: number;
  resources: ResourceProgress;
}

interface OfflineProgressProps {
  offlineTime: number;
  progress: OfflineProgress;
  lastActivity: Activity;
  onClose: () => void;
}

export const OfflineProgressModal: React.FC<OfflineProgressProps> = ({
  offlineTime,
  progress,
  lastActivity,
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

  const formatResourceName = (name: string) => {
    // Capitalize first letter and handle camelCase/snake_case if needed
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Welcome Back!</h2>
        <p>You were away for {formatTime(offlineTime)}</p>
        <p className="text-sm text-gray-600">Last activity: {lastActivity}</p>
        
        <div className="my-4">
          <h3 className="font-semibold">While you were away:</h3>
          <div className="mt-2 space-y-2">
            {progress[lastActivity] && (
              <div className="border-b pb-2">
                <h4 className="font-medium capitalize">{lastActivity}</h4>
                <ul className="ml-4">
                  <li>Experience: +{Math.floor(progress[lastActivity].experience)}</li>
                  {Object.entries(progress[lastActivity].resources).map(([resourceName, amount]) => (
                    <li key={resourceName}>
                      {formatResourceName(resourceName)}: +{Math.floor(amount)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
