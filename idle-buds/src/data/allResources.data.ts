import { Resource } from '../types/resourceNode.types';
import { woodResources } from './nodes/wood.data';
import { oreResources } from './nodes/ore.data';

// Import other resource types as needed

export const allResources: Resource[] = [
  ...woodResources,
  ...oreResources,
  // Add other resource arrays here
];