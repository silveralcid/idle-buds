interface SkillConfig {
    id: string;
    name: string;
    baseExperience: number;
    xpMultiplier: number;
  }
  
  export const skillsConfig: Record<string, SkillConfig> = {
    mining: {
      id: "mining",
      name: "Mining",
      baseExperience: 100,
      xpMultiplier: 1.5,
    },
  };
  