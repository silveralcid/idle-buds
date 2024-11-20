import { budBase } from '../types/budBase.types';
import { budInstance } from '../types/budInstance.types';

export function createBudInstance(base: budBase, id: string): budInstance {
  return {
    ...base,
    id,
    level: 1,
    experience: 0,
    gender: Math.random() > 0.5 ? 'male' : 'female',
    // Additional properties can be added here
  };
}