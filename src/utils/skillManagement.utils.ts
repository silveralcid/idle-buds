import { Skill } from '../types/skill.types';

export const increaseSkillExperience = (skills: Record<string, Skill>, skillId: string, amount: number) => {
  const skill = skills[skillId];
  if (!skill) return skills;

  const newExperience = skill.experience + amount;
  if (newExperience >= skill.experienceToNextLevel) {
    return {
      ...skills,
      [skillId]: {
        ...skill,
        experience: newExperience - skill.experienceToNextLevel,
        level: skill.level + 1,
        experienceToNextLevel: skill.experienceToNextLevel * 1.1, // Example scaling
      },
    };
  }
  return {
    ...skills,
    [skillId]: {
      ...skill,
      experience: newExperience,
    },
  };
};