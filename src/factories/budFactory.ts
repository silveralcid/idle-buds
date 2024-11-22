import { budBase } from "../types/budBase.types";
import { budInstance } from "../types/budInstance.types";
import { v4 as uuidv4 } from 'uuid';

export function createBudInstance(base: budBase): budInstance {
  const bud = {
    ...base,
    id: uuidv4(),
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    gender: Math.random() > 0.5 ? 'male' : 'female' as 'male' | 'female' | 'none',
    // Additional properties can be added here
  };
  console.log('Created Bud:', bud);
  return bud;
}