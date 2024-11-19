// src/hooks/useResourceGathering.ts
import { useEffect } from 'react';
import { useHunterStore } from '../stores/hunter.store';
import { useBankStore } from '../stores/bank.store';
import { useResourceStore } from '../stores/resource.store';
import { ItemType } from '../enums/item.enums';
import { BankedResource } from '../stores/bank.store';
import { ResourceType } from '../enums/resource.enums';
import { ProgressionTier } from '../enums/game.enums';
import { TreeNode } from '../types/tree.types';

export const useResourceGathering = () => {
  const currentActivity = useHunterStore(state => state.currentActivity);
  const addResource = useBankStore(state => state.depositItem);
  const nodes = useResourceStore(state => state.nodes);

  useEffect(() => {
    // First check if nodeId exists
    if (!currentActivity?.isActive || !currentActivity.nodeId) return;
  
    const nodeId = currentActivity.nodeId; // This ensures nodeId is defined
    const node = nodes[nodeId];
    if (!node) return;
    
    console.log('Starting gathering for node:', nodeId);
  
    const gatheringInterval = setInterval(() => {
      const node = nodes[nodeId]; // Use the defined nodeId here
        const resourcesGained = node.resourcesPerTick;
        const treeNode = node as TreeNode;

      
      addResource({
        id: `${treeNode.woodType.toLowerCase()}_logs`,
        name: `${treeNode.woodType.split('_').slice(1, -1).join(' ')} Logs`,
        itemType: ItemType.RESOURCE,
        resourceType: ResourceType.LOGS,
        quantity: resourcesGained,
        tier: node.tier
      } as BankedResource);
        
      console.log('Resources deposited:', resourcesGained);
  
    }, 50);
  
    return () => {
        console.log('Stopping gathering'); // Debug log
        clearInterval(gatheringInterval);
      };
    }, [currentActivity, nodes, addResource]);
  };