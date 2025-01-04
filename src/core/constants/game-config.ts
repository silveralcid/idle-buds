// Game Configuration Types
type TickConfig = {
  RATE: {
    DEFAULT: number;
    MAX: number;
    MIN: number;
  };
  DURATION: number;
};

type ExperienceConfig = {
  BASE_XP: number;
  GROWTH_FACTOR: number;
  LEVEL_SCALING: number;
  PENALTY_SCALING: number;
  MAX_LEVEL: number;
  EVOLUTION_LEVELS: {
    FIRST: number;
    SECOND: number;
    THIRD: number;
    ASCENDED: number;
  };
  GATHER_RATE_MODIFIER: number;
};

export const GameConfig = {
  // System Settings
  TICK: {
    RATE: {
      DEFAULT: 20,
      MAX: 60,
      MIN: 1
    },
    get DURATION() {
      return 1000 / this.RATE.DEFAULT;
    }
  } as TickConfig,

  // Save System
  SAVE: {
    AUTO_INTERVAL: 5000,
    MAX_OFFLINE_TIME: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    VERSION: '0.0.1'
  },

  // Experience System
  EXPERIENCE: {
    BASE_XP: 100,
    GROWTH_FACTOR: 1.5,
    LEVEL_SCALING: 0.1,
    PENALTY_SCALING: 0.2,
    MAX_LEVEL: 100,
    EVOLUTION_LEVELS: {
      FIRST: 14,
      SECOND: 34,
      THIRD: 54,
      ASCENDED: 100
    },
    GATHER_RATE_MODIFIER: 1.0
  } as ExperienceConfig,

  // Bud Management
  BUD: {
    STORAGE: {
      BOX_CAPACITY: 100,
      PARTY_CAPACITY: 5,
      MAX_ASSIGNED_PER_NODE: 1
    },
    STAT_MULTIPLIERS: {
      BABY: 1.0,
      FIRST_PHASE: 1.15,
      SECOND_PHASE: 1.30,
      THIRD_PHASE: 1.50
    },
    ACTIVITY_MODIFIER: 1.0,
    GATHER_RATE_MODIFIER: 1.0
  },

  // Activity Settings
  ACTIVITY: {
    GATHER: {
      BASE_RATE: 1.0,
      EFFICIENCY_MULTIPLIER: 10,
      EXPERIENCE_MULTIPLIER: 10
    },
    CRAFT: {
      BASE_RATE: 1.0,
      EFFICIENCY_MULTIPLIER: 10,
      EXPERIENCE_MULTIPLIER: 10
    },
    NODE: {
      DEFAULT_HEALTH: 100,
      DEFAULT_REGEN: 0.1,
      MAX_BUDS_PER_NODE: 3
    }
  },

  // Region Settings
  REGION: {
    TOTAL_REGIONS: 8,
    MIN_AREAS_PER_REGION: 2,
    MIN_POI_PER_AREA: 3
  }
} as const;