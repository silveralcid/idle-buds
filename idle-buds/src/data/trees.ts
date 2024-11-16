import { Tree } from '../types/resources';

export const TREES: Tree[] = [
  {
    id: 'normal_tree',
    name: 'Normal Tree',
    requiredLevel: 1,
    xpPerCut: 25,
    timeToChop: 3000,
    resourceName: 'normal_logs'
    },
    {
    id: 'oak_tree',
    name: 'Oak Tree',
    requiredLevel: 5,
    xpPerCut: 37.5,
    timeToChop: 4000,
    resourceName: 'oak_logs'
   },

];
