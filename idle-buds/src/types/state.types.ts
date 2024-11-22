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
    resetHunter: () => void;
}
  
export interface GameState {
    // Resources
      items: Record<string, number>;
      fractionalItems: Record<string, number>;
      fractionalXP: Record<string, number>;
  
    // Activities
      isGathering: boolean;
      currentActivity: string | null; // Hunter's current activity
      budActivity: string | null; // Bud's current activity
      startGathering: (activityId: string, isBud: boolean) => void;
      stopHunterGathering: () => void;
      stopBudGathering: () => void;
      updateResources: (deltaTime: number) => void;
  
  // 
    isPaused: boolean;
    pauseGame: () => void;
    unpauseGame: () => void;
    saveGame: () => void;
    loadGame: () => void;
    resetGame: () => void;
    lastSaveTime: number;
    togglePause: () => void;
    isInitialLoad: boolean;
}