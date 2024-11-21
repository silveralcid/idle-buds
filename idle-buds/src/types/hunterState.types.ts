import { Skill } from './skill.types';
import { budInstance } from './budInstance.types';

export interface HunterState {
    skills: Record<string, Skill>;
    increaseSkillExperience: (skillId: string, amount: number) => void;
    setSkillLevel: (skillId: string, level: number) => void;
    setSkillExperience: (skillId: string, experience: number) => void;
    refreshSkills: () => void;
    party: budInstance[];
    addBudToParty: (bud: budInstance) => void;
    removeBudFromParty: (budId: string) => void;
    increaseBudExperience: (budId: string, amount: number) => void;
  }