export interface BaseSkill {
  // Skill metadata
  id: string;
  name: string;
  description: string;
  
  // Skill progression
  xp: number;           // Experience points
  level: number;        // Current level
  progress: number;     // Percentage progress toward next level
  
  // Unlocking and dependencies
  isUnlocked: boolean;                // If the skill is currently unlocked
  unlockRequirements?: string[];      // Optional list of requirements to unlock
}
