import React, { useState, useEffect } from 'react';
import { ResourceNode } from '../../types/resourceNode.types';
import { useHunterStore } from '../../stores/hunter.store';
import { useActivityStore } from '../../stores/activity.store';
import { useBudAssignment } from '../../hooks/useBudAssignment';

interface ResourceCardProps {
  resource: ResourceNode;
  assignedBuds: string[];
  onAssignBud: (budId: string) => void;
  onRemoveBud: (budId: string) => void;
  onActivate: () => void;
  skillId: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, assignedBuds, onAssignBud, onRemoveBud, onActivate, skillId }) => {
  const [isUnlocked, setIsUnlocked] = useState(resource.isUnlocked);
  const skill = useHunterStore((state) => state.skills[skillId]);
  const party = useHunterStore((state) => state.party);
  
  const { assignedBud, assign, unassign } = useBudAssignment(resource.id, 'gathering');
  const hunterActivity = useActivityStore((state) => state.hunterActivity);
  const getBudActivity = useActivityStore((state) => state.getBudActivity);
  const startActivity = useActivityStore((state) => state.startActivity);
  const stopActivity = useActivityStore((state) => state.stopActivity);
  const progress = useActivityStore((state) => state.getProgress(resource.id));

  useEffect(() => {
    if (skill && skill.level >= resource.levelRequired) {
      setIsUnlocked(true);
    }
  }, [skill, resource.levelRequired]);

  const isHunterActive = hunterActivity?.nodeId === resource.id;
  const isBudActive = assignedBud && getBudActivity(assignedBud.id)?.nodeId === resource.id;

  const handleGather = () => {
    if (!isUnlocked) return;

    if (assignedBud) {
      if (isBudActive) {
        stopActivity('bud', assignedBud.id);
      } else {
        startActivity('bud', {
          type: 'gathering',
          nodeId: resource.id,
          budId: assignedBud.id
        });
      }
    } else {
      if (isHunterActive) {
        stopActivity('hunter');
      } else {
        startActivity('hunter', {
          type: 'gathering',
          nodeId: resource.id
        });
      }
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
                className={`btn ${(isBudActive || isHunterActive) ? 'btn-error' : 'btn-primary'}`}
              >
                {(isBudActive || isHunterActive) ? 'Stop' : 'Gather'}
              </button>

              {assignedBud ? (
                <div className="flex items-center gap-2">
                  <img src={assignedBud.spriteRef} alt={assignedBud.name} className="w-8 h-8" />
                  <div className="text-sm">
                    <div>{assignedBud.name}</div>
                    <div>Level: {assignedBud.level}</div>
                  </div>
                  <button
                    onClick={() => unassign()}
                    className="btn btn-ghost btn-circle text-error"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <select
                  className="select select-bordered w-48"
                  onChange={(e) => assign(e.target.value)}
                >
                  <option value="">Assign Bud</option>
                  {party.map((bud) => (
                    <option key={bud.id} value={bud.id}>
                      {bud.name}
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