import React, { useState, useEffect } from 'react';
import { ResourceNode } from '../../types/resourceNode.types';
import { useHunterStore } from '../../stores/hunter.store';

interface ResourceCardProps {
  resource: ResourceNode;
  skillId: string;
  onActivate: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource, 
  skillId,
  onActivate 
}) => {
  const [isUnlocked, setIsUnlocked] = useState(resource.isUnlocked);
  const skill = useHunterStore((state) => state.skills[skillId]);
  
  // Hunter activity management
  const hunterActivity = useHunterStore((state) => state.currentActivity);
  const startHunterActivity = useHunterStore((state) => state.startHunterActivity);
  const stopHunterActivity = useHunterStore((state) => state.stopHunterActivity);
  const hunterProgress = useHunterStore((state) => 
    state.getHunterActivityProgress(resource.id)
  );




  useEffect(() => {
    if (skill && skill.level >= resource.levelRequired) {
      setIsUnlocked(true);
    }
  }, [skill, resource.levelRequired]);

  const isHunterActive = hunterActivity?.nodeId === resource.id;


  const handleGather = () => {
    if (!isUnlocked) return;

    if (isHunterActive) {
      stopHunterActivity();
    } else {
      startHunterActivity('gathering', resource.id);
      onActivate();
    }
  };

  // Calculate total progress as max of hunter and bud progress
  const totalProgress = Math.max(hunterProgress);

  return (
    <div className={`card shadow-lg ${isUnlocked ? 'opacity-100' : 'opacity-50'} ${( isHunterActive) ? 'bg-success' : 'bg-base-200'}`}>
      <div className="card-body">
        <h3 className="card-title">{resource.name}</h3>
        <p className="text-sm opacity-70">Region: {resource.region}</p>
        
        <div className="space-y-2">
          <progress 
            className="progress progress-secondary w-full" 
            value={totalProgress} 
            max={100} 
          />
          <progress
            className="progress progress-primary w-full"
            value={resource.nodeHealth}
            max={resource.maxHealth}
          />
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span>Resources/hr: {resource.gatherRate}</span>
            <span>Level Required: {resource.levelRequired}</span>
            <span>Tier: {resource.tier}</span>
            <span>Renewable: {resource.isRenewable ? 'Yes' : 'No'}</span>
            <span>Efficiency: {resource.gatherEfficiency}</span>
            <span>Regen Rate: {resource.regenRate}</span>
            <span>XP/Tick: {resource.experienceGain}</span>
            <span>Yields: {resource.resourceNodeYields.join(', ')}</span>
          </div>

          {isUnlocked && (
            <div className="flex justify-between mt-4">
              <button
                onClick={handleGather}
                className={`btn ${isHunterActive ? 'btn-error' : 'btn-primary'}`}
              >
                {isHunterActive ? 'Stop' : 'Gather'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;