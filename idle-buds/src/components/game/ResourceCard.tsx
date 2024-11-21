import React, { useState, useEffect } from 'react';
import { Resource } from '../../types/resource.types';
import { useHunterStore } from '../../stores/hunter.store';
import { useGameStore } from '../../stores/game.store';
import { moveBudToResource, moveBudToParty, moveBudFromResourceToParty } from '../../utils/budManagement';
import { useResourceAssignmentStore } from '../../stores/resourceAssignment.store';

interface ResourceCardProps {
  resource: Resource;
  onActivate: (resourceId: string) => void;
  skillId: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onActivate, skillId }) => {
  const [isUnlocked, setIsUnlocked] = useState(resource.isUnlocked);
  const skill = useHunterStore((state) => state.skills[skillId]);
  const budActivity = useGameStore((state) => state.budActivity);
  const party = useHunterStore((state) => state.party);
  const { assignments } = useResourceAssignmentStore();
  const currentActivity = useGameStore((state) => state.currentActivity);
  useEffect(() => {
    if (skill && skill.level >= resource.levelRequired) {
      setIsUnlocked(true);
    }
  }, [skill, resource.levelRequired]);

  const handleBudGather = () => {
    if (!isUnlocked) return;
    const assignedBud = assignments[resource.id];
    if (assignedBud) {
      if (budActivity === resource.id) {
        useGameStore.getState().stopBudGathering();
      } else {
        useGameStore.getState().startGathering(resource.id, true);
      }
    }
  };
  
  const handleHunterGather = () => {
    if (!isUnlocked) return;
    if (currentActivity === resource.id) {
      useGameStore.getState().stopHunterGathering();
    } else {
      onActivate(resource.id);
    }
  };

  const handleAssignBud = (budId: string) => {
    if (budId) {
      moveBudToResource(budId, resource.id);
      useGameStore.getState().startGathering(resource.id, true);
    }
  };

  const handleRemoveBud = () => {
    const assignedBud = assignments[resource.id];
    if (assignedBud) {
      console.log(`Removing Bud from resource: ${assignedBud.id}`);
      moveBudFromResourceToParty(assignedBud.id, resource.id);
    }
  };

  const assignedBud = assignments[resource.id];

  return (
    <div className={`card shadow-lg ${isUnlocked ? 'opacity-100' : 'opacity-50'} ${(budActivity === resource.id || currentActivity === resource.id) ? 'bg-success' : 'bg-base-200'}`}>
      <div className="card-body relative">
        <h3 className="card-title flex justify-between">
          {resource.name}
        </h3>
        <p className="text-sm opacity-70">Region: {resource.region}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <progress className="progress progress-secondary w-full" value={0} max={100} />
          </div>
          <progress
            className="progress progress-primary w-full"
            value={resource.nodeHealth}
            max={resource.maxHealth}
          />
          <div className="flex justify-between text-sm">
            <span>Resources/hr: {resource.gatherRate}</span>
            <span>Level Required: {resource.levelRequired}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Rarity: {resource.rarity}</span>
            <span>Value: {resource.value}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tier: {resource.tier}</span>
            <span>Renewable: {resource.isRenewable ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Gather Efficiency: {resource.gatherEfficiency}</span>
            <span>Regen Rate: {resource.regenRate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>XP Gain/Tick: {resource.experienceGain}</span>
          </div>
          {isUnlocked && (
            <div className="flex justify-between mt-4">
              <button
                onClick={assignedBud ? handleBudGather : handleHunterGather}
                className={`btn ${(assignedBud && budActivity === resource.id) || (!assignedBud && currentActivity === resource.id) ? 'btn-danger' : 'btn-primary'}`}
              >
                {(assignedBud && budActivity === resource.id) || (!assignedBud && currentActivity === resource.id) ? 'Stop' : 'Gather'}
              </button>
              {assignedBud ? (
                <div className="flex items-center space-x-2">
                  <img src={assignedBud.spriteRef} alt={assignedBud.name} className="w-8 h-8" />
                  <div className="text-sm">
                    <div>{assignedBud.name}</div>
                    <div>Level: {assignedBud.level}</div>
                    <div>XP: {assignedBud.experience}/{assignedBud.experienceToNextLevel}</div>
                  </div>
                  <button
                    onClick={handleRemoveBud}
                    className="text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <div>
                  <label htmlFor="bud-select" className="block text-sm font-medium text-gray-700">
                    Assign Bud:
                  </label>
                  <select
                    id="bud-select"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    onChange={(e) => handleAssignBud(e.target.value)}
                  >
                    <option value="">Select a Bud</option>
                    {party.map((bud) => (
                      <option key={bud.id} value={bud.id}>
                        {bud.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;