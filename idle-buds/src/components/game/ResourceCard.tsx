import React, { useState, useEffect } from 'react';
import { Resource } from '../../types/resource.types';
import { useHunterStore } from '../../stores/hunter.store';
import { useGameStore } from '../../stores/game.store';

interface ResourceCardProps {
  resource: Resource;
  onActivate: (resourceId: string) => void;
  skillId: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onActivate, skillId }) => {
  const [isUnlocked, setIsUnlocked] = useState(resource.isUnlocked);
  const skill = useHunterStore((state) => state.skills[skillId]);
  const currentActivity = useGameStore((state) => state.currentActivity);
  const party = useHunterStore((state) => state.party);

  useEffect(() => {
    if (skill && skill.level >= resource.levelRequired) {
      setIsUnlocked(true);
    }
  }, [skill, resource.levelRequired]);

  const handleCardClick = () => {
    if (!isUnlocked) return;
    if (currentActivity === resource.id) {
      useGameStore.getState().stopGathering();
    } else {
      onActivate(resource.id);
    }
  };

  return (
    <div
      className={`card shadow-lg cursor-pointer ${
        isUnlocked ? 'opacity-100' : 'opacity-50'
      } ${currentActivity === resource.id ? 'bg-success' : 'bg-base-200'}`}
      onClick={handleCardClick}
    >
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
            <div className="absolute top-2 right-2">
              <label htmlFor="bud-select" className="block text-sm font-medium text-gray-700">
                Assign Bud:
              </label>
              <select id="bud-select" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option value="">Select a Bud</option>
                {party.map((bud) => (
                  <option key={bud.id} value={bud.id}>
                    <img src={bud.spriteRef} alt={bud.name} className="w-8 h-8 inline-block" />
                    {bud.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;