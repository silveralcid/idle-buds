import React, { useState, useEffect } from 'react';
import { ResourceNode } from '../../types/resourceNode.types';
import { useHunterStore } from '../../stores/hunter.store';


interface ResourceCardProps {
  resource: ResourceNode;
  skillId: string;
  onActivate: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, skillId, onActivate }) => {
  const [isUnlocked, setIsUnlocked] = useState(resource.isUnlocked);
  
  // Get skill level for requirements check
  const skill = useHunterStore((state) => state.skills[skillId]);
  
  // Get hunter activity state
  const hunterActivity = useHunterStore((state) => state.currentHunterActivity);
  const startHunterGathering = useHunterStore((state) => state.startHunterGathering);
  const stopHunterActivity = useHunterStore((state) => state.stopHunterActivity);
  
  // Get gathering progress
  const gatheringProgress = useHunterStore((state) => {
    if (!state.currentHunterActivity || 
        state.currentHunterActivity.type !== 'gathering' || 
        state.currentHunterActivity.nodeId !== resource.id) {
      return 0;
    }
    return Object.values(state.currentHunterActivity.gatheringProgress.resourcesGained)[0] || 0;
  });

  // Check level requirements
  useEffect(() => {
    if (skill && skill.level >= resource.levelRequired) {
      setIsUnlocked(true);
    }
  }, [skill, resource.levelRequired]);

  const isActiveNode = hunterActivity?.type === 'gathering' && 
                      hunterActivity.nodeId === resource.id;

  const handleGather = () => {
    if (!isUnlocked) return;
    
    if (isActiveNode) {
      stopHunterActivity();
    } else {
      startHunterGathering(resource.id);
      onActivate();
    }
  };

  return (
    <div className={`card shadow-lg ${isUnlocked ? 'opacity-100' : 'opacity-50'} 
                    ${isActiveNode ? 'bg-success' : 'bg-base-200'}`}>
      <div className="card-body">
        <h3 className="card-title">{resource.name}</h3>
        <p className="text-sm opacity-70">Region: {resource.region}</p>
        
        <div className="space-y-2">
          {/* Gathering Progress Bar */}
          <progress 
            className="progress progress-secondary w-full" 
            value={gatheringProgress} 
            max={100} 
          />
          
          {/* Resource Health Bar */}
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
                className={`btn ${isActiveNode ? 'btn-error' : 'btn-primary'}`}
              >
                {isActiveNode ? 'Stop' : 'Gather'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;