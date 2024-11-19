import React from 'react';

import { useResourceStore } from '../../stores/resource.store';
import { useHunterStore } from '../../stores/hunter.store';
import { ResourceType } from '../../enums/resource.enums';
import { ActivityType } from '../../enums/activity.enums';
import { TreeNode } from '../../types/tree.types';

const LumberingView = () => {
  const nodes = useResourceStore(state => state.nodes);
  const updateNode = useResourceStore(state => state.updateNode);
  const hunterLevel = useHunterStore(state => 
    state.activityLevels.lumbering.level
  );
  const currentActivity = useHunterStore(state => state.currentActivity);
  const setCurrentActivity = useHunterStore(state => state.setCurrentActivity);

  const handleStartGathering = (nodeId: string) => {
    setCurrentActivity({
      type: ActivityType.lumbering,
      startTime: Date.now(),
      lastTickProcessed: Date.now(),
      lastActiveTime: Date.now(),
      isActive: true,
      nodeId
    });
  };

  const handleStopGathering = () => {
    setCurrentActivity(undefined);
  };

  const calculateResourcesPerHour = (resourcesPerTick: number) => {
    return Math.floor(resourcesPerTick * 20 * 60 * 60);
  };


  return (
    <div className="h-full flex flex-col gap-4">
      {/* Activity Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Lumbering</h2>
          <p className="text-sm opacity-70">Level: 1 | XP: 0/100</p>
        </div>
        <div className="badge badge-primary">Active</div>
      </div>

      {/* Resource Nodes */}
      <div className="grid grid-cols-2 gap-4 flex-grow overflow-auto">
        {Object.values(nodes).map((node) => {
          const isLocked = hunterLevel < node.requirements.activityLevel;
          const isActive = currentActivity?.nodeId === node.id;
          const treeNode = node as TreeNode;
          return (
            <div 
              key={node.id} 
              className={`card bg-base-200 shadow-lg ${isLocked ? 'opacity-50' : ''}`}
            >
              <div className="card-body">
                <h3 className="card-title flex justify-between">
                  {node.region}
                  {isLocked && (
                    <div className="badge badge-secondary">Locked</div>
                  )}
                </h3>
                <div className="space-y-2">
                  <progress 
                    className="progress progress-primary w-full" 
                    value={treeNode.treeHealth.current} 
                    max={treeNode.treeHealth.max}
                  />
                  <div className="flex justify-between text-sm">
                    <span>Resources/hr: {calculateResourcesPerHour(node.resourcesPerTick)}</span>
                    <span>Level Required: {node.requirements.activityLevel}</span>
                  </div>
                  <div className="card-actions justify-end">
                    {isLocked ? (
                      <button className="btn btn-secondary btn-sm" disabled>
                        Unlock at Level {node.requirements.activityLevel}
                      </button>
                    ) : (
                      <button 
                      className={`btn ${isActive ? 'btn-error' : 'btn-primary'} btn-sm`}
                      onClick={() => isActive ? handleStopGathering() : handleStartGathering(node.id)}
                      disabled={currentActivity && !isActive}
                    >
                      {isActive ? 'Stop Gathering' : 'Start Gathering'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LumberingView;