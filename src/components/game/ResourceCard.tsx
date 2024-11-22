import React, { useState, useEffect } from 'react';
import { ResourceNode } from '../../types/resourceNode.types';
import { useHunterStore } from '../../stores/hunter.store';
import { useActiveBudStore } from '../../stores/active-bud.store';
import { unassignBudFromGathering, assignBudToGathering } from '../../utils/bud-management.utils';
import { getBudParty } from '../../stores/active-bud.store';

interface ResourceCardProps {
  resource: ResourceNode;
  skillId: string;
  assignedBuds: string[];
  onAssignBud: (budId: string) => void;
  onRemoveBud: (budId: string) => void;
  onActivate: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource, 
  skillId,
  onAssignBud,
  onRemoveBud, 
  onActivate 
}) => {
  const [isUnlocked, setIsUnlocked] = useState(resource.isUnlocked);
  const skill = useHunterStore((state) => state.skills[skillId]);
  const party = useActiveBudStore(getBudParty);
  
  // Hunter activity management
  const hunterActivity = useHunterStore((state) => state.currentActivity);
  const startHunterActivity = useHunterStore((state) => state.startHunterActivity);
  const stopHunterActivity = useHunterStore((state) => state.stopHunterActivity);
  const hunterProgress = useHunterStore((state) => 
    state.getHunterActivityProgress(resource.id)
  );

  // Bud activity management
  const budActivities = useActiveBudStore((state) => state.budActivities);
  const startBudActivity = useActiveBudStore((state) => state.startBudActivity);
  const stopBudActivity = useActiveBudStore((state) => state.stopBudActivity);
  const budProgress = useActiveBudStore((state) => 
    state.getBudProgress(resource.id)
  );

  // Find assigned bud by checking activities
  const assignedBud = party.find(bud => 
    budActivities[bud.id]?.nodeId === resource.id
  );

  useEffect(() => {
    if (skill && skill.level >= resource.levelRequired) {
      setIsUnlocked(true);
    }
  }, [skill, resource.levelRequired]);

  const isHunterActive = hunterActivity?.nodeId === resource.id;
  const isBudActive = assignedBud && budActivities[assignedBud.id]?.nodeId === resource.id;

  const handleAssignBud = (budId: string) => {
    if (!budId || !isUnlocked) return;
    
    console.log('🎯 Attempting to assign bud:', { budId, nodeId: resource.id });
    const success = assignBudToGathering(budId, resource.id);
    
    if (success) {
      onAssignBud(budId);
      console.log('✅ Successfully assigned bud to gathering');
    } else {
      console.warn('❌ Failed to assign bud to gathering');
    }
  };

  const handleUnassignBud = () => {
    if (!assignedBud) return;
    
    const success = unassignBudFromGathering(assignedBud.id, resource.id);
    if (success) {
      onRemoveBud(assignedBud.id);
    }
  };

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
  const totalProgress = Math.max(hunterProgress, budProgress);

  return (
    <div className={`card shadow-lg ${isUnlocked ? 'opacity-100' : 'opacity-50'} ${(isBudActive || isHunterActive) ? 'bg-success' : 'bg-base-200'}`}>
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

              {assignedBud ? (
                <div className="flex items-center gap-2 bg-base-200 p-2 rounded-lg">
                  <img 
                    src={assignedBud.spriteRef} 
                    alt={assignedBud.name} 
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-sm">
                    <div className="font-semibold">{assignedBud.name}</div>
                    <div className="flex flex-col gap-1">
                      <div>Level: {assignedBud.level}</div>
                      <div className="w-32">
                        <div className="text-xs text-opacity-70">XP: {assignedBud.experience}/{assignedBud.experienceToNextLevel}</div>
                        <progress 
                          className="progress progress-info w-full h-1.5" 
                          value={assignedBud.experience} 
                          max={assignedBud.experienceToNextLevel}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleUnassignBud}
                    className="btn btn-ghost btn-circle btn-sm text-error"
                    title="Remove assignment"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <select
                  className="select select-bordered w-48"
                  onChange={(e) => handleAssignBud(e.target.value)}
                  value=""
                >
                  <option value="">Assign Bud</option>
                  {party
                    .filter(bud => !budActivities[bud.id]) // Only show unassigned buds
                    .map((bud) => (
                      <option key={bud.id} value={bud.id}>
                        {bud.name} (Lvl {bud.level})
                      </option>
                    ))}
                </select>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;