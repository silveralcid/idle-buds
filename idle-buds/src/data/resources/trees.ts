import { Tree } from "../../features/common/resource.types";

export const Trees: Tree[] = [
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
    requiredLevel: 15,
    xpPerCut: 37.5,
    timeToChop: 4000,
    resourceName: 'oak_logs'
  },
  {
    id: 'willow_tree',
    name: 'Willow Tree',
    requiredLevel: 30,
    xpPerCut: 67.5,
    timeToChop: 4500,
    resourceName: 'willow_logs'
  },
  {
    id: 'maple_tree',
    name: 'Maple Tree',
    requiredLevel: 45,
    xpPerCut: 100,
    timeToChop: 5000,
    resourceName: 'maple_logs'
  },
  {
    id: 'yew_tree',
    name: 'Yew Tree',
    requiredLevel: 60,
    xpPerCut: 175,
    timeToChop: 6000,
    resourceName: 'yew_logs'
  },
  {
    id: 'magic_tree',
    name: 'Magic Tree',
    requiredLevel: 75,
    xpPerCut: 250,
    timeToChop: 7000,
    resourceName: 'magic_logs'
  },
  {
    id: 'elder_tree',
    name: 'Elder Tree',
    requiredLevel: 85,
    xpPerCut: 325,
    timeToChop: 8000,
    resourceName: 'elder_logs'
  },
  {
    id: 'crystal_tree',
    name: 'Crystal Tree',
    requiredLevel: 95,
    xpPerCut: 425,
    timeToChop: 9000,
    resourceName: 'crystal_logs'
  }
];
