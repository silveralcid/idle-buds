import { skillsConfig } from "../data/skills.data";

export const calculateExperienceRequirement = (skillId: string, level: number): number => {
    const skillConfig = skillsConfig[skillId];
    if (!skillConfig) {
      throw new Error(`Skill configuration not found for skillId: ${skillId}`);
    }
  
    const { baseExperience, xpMultiplier } = skillConfig;
    return Math.floor(baseExperience * Math.pow(xpMultiplier, level - 1));
  };
  
  