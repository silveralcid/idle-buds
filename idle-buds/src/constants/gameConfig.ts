export const GameConfig = {

  // Tick Settings
    ticksPerSecond: 20,
    maxTicksPerSecond: 60,
    minTicksPerSecond: 1,
    get tickDuration() {
      return 1000 / this.ticksPerSecond; // Calculate tick duration in milliseconds
    },

  // Bud Management
    budBoxCapacity: 100,
    partyCapacity: 2,

  // Auto Save
    autoSaveInterval: 5000, // 5 seconds
    
  // Gain Modifiers
    gatherRateModifier: 10,
    experienceGainModifier: 10,
  };