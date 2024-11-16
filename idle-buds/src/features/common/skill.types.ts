import { Tree } from './resource.types';

export interface WoodcuttingSkill {
  level: number;
  experience: number;
  isChopping: boolean;
  currentTree?: Tree;
  progress: number;
}
