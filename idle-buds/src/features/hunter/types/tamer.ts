import type { 
    BudStorage, 
    BudTeam, 
    BreedingFacility, 
    BudCollection 
  } from '../../buds/types/bud';
  
// Combat-specific stats for the Tamer
export interface TamerCombatStats {
    // Base Stats
    maxHealth: number;
    currentHealth: number;
    maxStamina: number;
    currentStamina: number;
    
    // Combat Stats
    attack: number;
    defense: number;
    efficiency: number; // Affects accuracy, evasion, and critical chance???
    accuracy: number;
    evasion: number;
    
    // Combat Modifiers
    staminaRegenRate: number;
    healthRegenRate: number;
    criticalChance: number;
    criticalMultiplier: number;
    
    // Bud-related Combat Bonuses
    budDamageBonus: number;
    budDefenseBonus: number;
    budControlEfficiency: number; // Affects how well you can control multiple buds
    
    // Combat Experience
    combatLevel: number;
    combatExperience: number;
    
    // Combat Specializations

  }
  // Core stats for the Tamer
  export interface TamerStats {
    totalExperience: number;
    totalLevels: number;
    highestLevel: number;
    totalPlayTime: number;
    budsDiscovered: number;
    budsCaptured: number;
    budsBreeded: number;
  }
  
  export interface TamerAchievements {
    totalAchievements: number;
    completedAchievements: string[];
    achievementPoints: number;
    rareBudsCaptured: string[];
    legendaryBudsCaptured: string[];
  }
  
  export interface TamerMilestones {
    resourcesGathered: number;
    itemsCrafted: number;
    buildingsConstructed: number;
    budsHatched: number;
    raidersDefeated: number;
    questsCompleted: number;
    dungeonClears: number;
  }
  
  export interface ActivityLog {
    activityType: 'idle' | 'combat' | 'woodcutting' | 'mining' | 'crafting' | 'fishing' | 'cooking' | 'smithing';
    timestamp: number;
    details: string;
    budInvolved?: string;
    location?: string;
  }
  
  export interface TamerDetails {
    // Basic Info
    id: string;
    name: string;
    createdAt: number;
    lastLogin: number;
    playTime: number;
    
    // Session Data
    sessionCount: number;
    currentSessionStart: number;
    longestSession: number;
    
    // Core Progress
    stats: TamerStats;
    milestones: TamerMilestones;
    achievements: TamerAchievements;
    
    // Bud Management
    budStorage: BudStorage;
    budTeams: BudTeam[];
    breedingFacilities: BreedingFacility[];
    budCollection: BudCollection;
    
    // Base Management
    baseLevel: number;
    buildings: {
      [buildingId: string]: {
        level: number;
        assignedBuds: string[];
        efficiency: number;
        production: {
          resource: string;
          rate: number;
        }[];
      }
    };
    
    // Resource Management
    inventory: {
      [itemId: string]: {
        amount: number;
        discovered: boolean;
      }
    };
    resourceProduction: {
      [resourceType: string]: {
        totalProduced: number;
        productionRate: number;
        automationLevel: number;
      }
    };
  
    // Skills & Progress
    skills: {
      [skillName: string]: {
        level: number;
        experience: number;
        unlocks: string[];
        masteryLevel: number;
        masteryExperience: number;
      }
    };
  
    // Combat & Adventure
    combatStats: {
      budTeamLevel: number;
      raidsCompleted: number;
      dungeonProgress: {
        [dungeonId: string]: {
          highestLevel: number;
          completions: number;
          bestTime: number;
        }
      };
    };
  
    // Technology & Research
    research: {
      completedResearch: string[];
      activeResearch?: string;
      researchPoints: number;
      unlockableTechnologies: string[];
    };
  
    // Game Settings
    preferences: {
      theme: 'light' | 'dark';
      notifications: boolean;
      autoSave: boolean;
      autoAssignBuds: boolean;
      resourcePriorities: string[];
    };
  
    // Time Tracking
    timeStats: {
      [activityType: string]: number;
      dailyPlayTime: { [date: string]: number };
      weeklyPlayTime: { [weekNumber: string]: number };
      monthlyPlayTime: { [month: string]: number };
    };
  
    // Quest & Event Progress
    quests: {
      active: string[];
      completed: string[];
      dailyProgress: {
        [questId: string]: number;
      };
    };
  
    // Social Features
    guild?: {
      id: string;
      rank: string;
      contribution: number;
    };
    friends: string[];
    tradingHistory: {
      timestamp: number;
      type: 'sent' | 'received';
      items: { id: string; amount: number }[];
      withPlayer: string;
    }[];
  
    // Economy
    economy: {
      currency: number;
      premiumCurrency: number;
      totalEarned: number;
      totalSpent: number;
    };
  }
  