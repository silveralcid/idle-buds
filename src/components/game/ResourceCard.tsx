import React, { useState, useEffect } from 'react';
import { ResourceNode } from '../../types/resourceNode.types';
import { useHunterStore } from '../../stores/hunter.store';
import { useActivityStore } from '../../stores/activity.store';
import { moveBudToNode, moveBudFromNodeToParty } from '../../utils/bud-management.utils';

interface ResourceCardProps {
  resource: ResourceNode;
  skillId: string;
  assignedBuds: string[];
  onAssignBud: (budId: string) => void;
  onRemoveBud: (budId: string) => void;
  onActivate: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, skillId, assignedBuds, onAssignBud, onRemoveBud, onActivate }) => {
  const [isUnlocked, setIsUnlocked] = useState(resource.isUnlocked);
  const skill = useHunterStore((state) => state.skills[skillId]);
  const party = useHunterStore((state) => state.party);
  
  const hunterActivity = useActivityStore((state) => state.hunterActivity);
  const getBudActivity = useActivityStore((state) => state.getBudActivity);
  const startActivity = useActivityStore((state) => state.startActivity);
  const stopActivity = useActivityStore((state) => state.stopActivity);
  const progress = useActivityStore((state) => state.getProgress(resource.id));

  // Find assigned bud by checking activities
  const assignedBud = party.find(bud => {
    const activity = getBudActivity(bud.id);
    return activity?.nodeId === resource.id;
  });

  useEffect(() => {
    if (skill && skill.level >= resource.levelRequired) {
      setIsUnlocked(true);
    }
  }, [skill, resource.levelRequired]);

  const isHunterActive = hunterActivity?.nodeId === resource.id;
  const isBudActive = assignedBud && getBudActivity(assignedBud.id)?.nodeId === resource.id;

  const handleAssignBud = (budId: string) => {
    if (!budId) return;
    
    const success = moveBudToNode(budId, resource.id);
    if (success) {
      startActivity('bud', {
        type: 'gathering',
        nodeId: resource.id,
        budId
      });
    }
  };

  const handleUnassignBud = () => {
    if (!assignedBud) return;
    
    stopActivity('bud', assignedBud.id);
    moveBudFromNodeToParty(assignedBud.id, resource.id);
  };

  const handleGather = () => {
    if (!isUnlocked) return;

    if (isHunterActive) {
      stopActivity('hunter');
    } else {
      startActivity('hunter', {
        type: 'gathering',
        nodeId: resource.id
      });
    }
  };

  return (
    <div className={`card shadow-lg ${isUnlocked ? 'opacity-100' : 'opacity-50'} ${(isBudActive || isHunterActive) ? 'bg-success' : 'bg-base-200'}`}>
      <div className="card-body">
        <h3 className="card-title">{resource.name}</h3>
        <p className="text-sm opacity-70">Region: {resource.region}</p>
        
        <div className="space-y-2">
          <progress 
            className="progress progress-secondary w-full" 
            value={progress} 
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
                    <div>Level: {assignedBud.level}</div>
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
                    .filter(bud => !getBudActivity(bud.id)) // Only show unassigned buds
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