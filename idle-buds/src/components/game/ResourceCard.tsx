import React, { useState, useEffect } from 'react';
import { Resource } from '../../types/resource.types';
import { useHunterStore } from '../../stores/hunter.store';
import { useGameStore } from '../../stores/game.store';

interface ResourceCardProps {
  resource: Resource;
  onActivate: (resourceId: string) => void;
  skillId: string; // Add a prop for the skill ID
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onActivate, skillId }) => {
  const [isUnlocked, setIsUnlocked] = useState(resource.isUnlocked);
  const skill = useHunterStore((state) => state.skills[skillId]);
  const currentActivity = useGameStore((state) => state.currentActivity); // Get current activity

  useEffect(() => {
    if (skill && skill.level >= resource.levelRequired) {
      setIsUnlocked(true);
    }
  }, [skill, resource.levelRequired]);

  const handleCardClick = () => {
    if (!isUnlocked) return; // Prevent activation if the card is locked
    if (currentActivity === resource.id) {
      useGameStore.getState().stopGathering();
    } else {
      onActivate(resource.id);
    }
  };

  return (
    <div
      className={`card shadow-lg cursor-pointer ${currentActivity === resource.id ? 'bg-success' : 'bg-base-200'}`}
      onClick={handleCardClick}
    >
      <div className="card-body">
        <h3 className="card-title flex justify-between">
          {resource.name}
          <div className={`badge ${isUnlocked ? 'badge-primary' : 'badge-secondary'}`}>
            {isUnlocked ? 'Unlocked' : 'Locked'}
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;