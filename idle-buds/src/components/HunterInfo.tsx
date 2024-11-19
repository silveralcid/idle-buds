import React from 'react';
import { useHunterStore } from '../stores/hunter.store';
import { ActivityType } from '../enums/activity.enums';
import { ItemType } from '../enums/item.enums';
import { useBankStore } from '../stores/bank.store';
import { TreeNode } from '../types/tree.types';
import { useResourceStore } from '../stores/resource.store';
import { useMemo } from 'react';

const HunterInfo = () => {
  const { stats, activityLevels, currentActivity } = useHunterStore();
  const bankItems = useBankStore(state => state.items);
  const getItemsByType = useBankStore(state => state.getItemsByType);
  const nodes = useResourceStore(state => state.nodes); // Add this line

  // Get only resource items from bank
  const resources = getItemsByType(ItemType.RESOURCE);
  const currentNode = useMemo(() => {
    if (currentActivity?.nodeId) {
      return nodes[currentActivity.nodeId] as TreeNode;
    }
    return null;
  }, [currentActivity, nodes]);  

  return (
    <div className="space-y-4">
      {/* Stats Section */}
      <div>
        <h3 className="font-bold text-lg mb-2">Stats</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Health: {stats.health}</div>
          <div>Wisdom: {stats.wisdom}</div>
          <div>Attack: {stats.attack}</div>
          <div>Defense: {stats.defense}</div>
          <div>Dexterity: {stats.dexterity}</div>
          <div>Points: {stats.attributePoints}</div>
        </div>
      </div>

      {/* Resources Section */}
      <div>
        <h3 className="font-bold text-lg mb-2">Resources</h3>
        <div className="space-y-1">
          {resources.map((resource) => (
            <div 
              key={resource.id} 
              className="flex justify-between items-center text-sm bg-base-200 p-2 rounded-lg"
            >
              <span className="capitalize">{resource.name}</span>
              <div className="flex items-center gap-2">
                <span>{Math.floor(resource.quantity)}</span>
                {currentActivity?.isActive && (
                  <span className="loading loading-spinner loading-xs text-primary"/>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Activity */}
      {currentActivity && (
        <div>
          <h3 className="font-bold text-lg mb-2">Current Activity</h3>
          <div className="bg-base-200 p-2 rounded-lg">
            <div className="capitalize">{currentActivity.type}</div>
            <div className="text-sm opacity-70">
              Active: {currentActivity.isActive ? 'Yes' : 'No'}
            </div>
            {currentActivity.isActive && currentNode && (
              <div className="text-sm mt-1">
                Resources/tick: {currentNode.resourcesPerTick}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Activity Levels */}
      <div>
        <h3 className="font-bold text-lg mb-2">Skills</h3>
        <div className="space-y-2">
          {Object.entries(activityLevels).map(([activity, info]) => (
            <div key={activity} className="text-sm">
              <div className="flex justify-between items-center">
                <span className="capitalize">{activity}</span>
                <span>Lvl {info.level}</span>
              </div>
              <progress 
                className="progress progress-primary w-full h-1.5" 
                value={info.currentXp} 
                max={info.requiredXp}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HunterInfo;