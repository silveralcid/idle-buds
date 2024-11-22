import { ResourceNode } from '../types/resourceNode.types';
import { lumberingResources } from './nodes/lumbering.data';
import { miningResources } from './nodes/mining.data';

// Import other resource types as needed

export const allResources: ResourceNode[] = [
  ...lumberingResources,
  ...miningResources,
  // Add other resource arrays here
];