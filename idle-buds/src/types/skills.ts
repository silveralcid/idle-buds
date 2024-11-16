import { Tree } from './resources';

export interface WoodcuttingSkill {
  level: number;
  experience: number;
  isChopping: boolean;
  currentTree?: Tree;
  progress: number;
}
