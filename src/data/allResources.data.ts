import { ResourceNode } from '../types/resourceNode.types';
import { lumberingNodes } from './nodes/lumbering.data';
import { miningNodes } from './nodes/mining.data';

// Import other resource types as needed

export const allResources: ResourceNode[] = [
  ...lumberingNodes,
  ...miningNodes,
  // Add other resource arrays here
];