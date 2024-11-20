import { v4 as uuidv4 } from 'uuid';
import { budBase } from '../types/budBase.types';
import { budInstance } from '../types/budInstance.types';

export function createBudInstance(base: budBase): budInstance {
  return {
    ...base,
    id: uuidv4(),
    level: 1,
    experience: 0,
    gender: Math.random() > 0.5 ? 'male' : 'female',
    // Additional properties can be added here
  };
}