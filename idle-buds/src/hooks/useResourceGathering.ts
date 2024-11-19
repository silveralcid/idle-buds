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
        console.log('Resource gathering effect triggered');
        console.log('Current activity:', currentActivity);
        console.log('Nodes:', nodes);

        // First check if nodeId exists
        if (!currentActivity?.isActive || !currentActivity.nodeId) {
            console.log('No active gathering or no nodeId');
            return;
        }
          
        
        const nodeId = currentActivity.nodeId; // This ensures nodeId is defined

          // Map nodeId to the correct key in the nodes object
        let nodeKey;
        switch (nodeId) {
            case "basic-tree-1":
                nodeKey = "TIER_1_WOOD";
                break;
            case "dense-tree-2":
                nodeKey = "TIER_2_WOOD";
                break;
            // Add more cases for other nodeIds
            default:
                console.log("Unknown nodeId:", nodeId);
                return;
        }

        const node = nodes[nodeKey];

        console.log('Node found:', node);

        if (!node || node.resourceType !== ResourceType.LOGS) {
            console.log('Invalid node or not a tree node');
            return;
          }
        
        const treeNode = node as TreeNode;
        console.log('Tree node found:', treeNode);

        const gatheringInterval = setInterval(() => {
            console.log('Gathering tick...');
            const resourcesGained = treeNode.resourcesPerTick;
            
            console.log('Adding resources:', resourcesGained);
            addResource({
                id: `${treeNode.woodType.toLowerCase()}_logs`,
                name: `${treeNode.woodType.split('_').slice(1, -1).join(' ')} Logs`,
                itemType: ItemType.RESOURCE,
                resourceType: ResourceType.LOGS,
                quantity: resourcesGained,
                tier: node.tier
            } as BankedResource);    
        }, 50);
  
    return () => {
        console.log('Stopping gathering'); // Debug log
        clearInterval(gatheringInterval);
      };
    }, [currentActivity, nodes, addResource]);
};
  

