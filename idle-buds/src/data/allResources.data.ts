import { Resource } from '../types/resource.types';
import { woodResources } from './resources/wood.data';
import { oreResources } from './resources/ore.data';

// Import other resource types as needed

export const allResources: Resource[] = [
  ...woodResources,
  ...oreResources,
  // Add other resource arrays here
];