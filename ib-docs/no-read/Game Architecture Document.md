# Interfaces

## Account Level

```TypeScript 
interface AccountState {
  // Account-wide Data
  userId: string;
  email: string;
  tamers: {
    [tamerId: string]: tamerSave;
  };
}
```

## Character Level

### Offline Progress
```TypeScript
interface OfflineProgress {
  lastOnline: Date;
  timeElapsed: number; // in seconds
  
  // Resource Accumulation
  pendingResources: {
    [resourceId: string]: {
      amount: number;
      source: string; // node/combat/event
      quality?: number;
    };
  };
  
  // Tamer Experience
  tamerProgress: {
    totalExperience: number;
    skillExperience: {
      [skillName: string]: number;
    };
    masteryExperience: {
      [skillName: string]: number;
    };
  };
  
  // Bud Experience
  budProgress: {
    [budId: string]: {
      totalExperience: number;
      skillExperience: {
        [skillName: string]: number;
      };
      taskEfficiency: number;
      timeSpentWorking: number;
    };
  };

  // Combat Loot
  combatLoot: {
    items: {
      [itemId: string]: {
        amount: number;
        rarity: string;
        source: string;
      };
    };
    currency: number;
  };

  // Captured Buds
  capturedBuds: {
    [budId: string]: {
      speciesId: string;
      level: number;
      isShiny: boolean;
      ballType: string;
      location: string;
      timestamp: Date;
    }[];
  };

  // Consumables Used
  consumablesUsed: {
    balls: {
      [ballType: string]: {
        used: number;
        successful: number;
        failed: number;
      };
    };
    food: {
      [foodId: string]: {
        amount: number;
        healingDone: number;
        target: 'tamer' | 'bud';
        budId?: string;
      };
    };
    medicine: {
      [medicineId: string]: {
        amount: number;
        effect: string;
        target: 'tamer' | 'bud';
        budId?: string;
      };
    };
    bait: {
      [baitId: string]: {
        amount: number;
        location: string;
      };
    };
  };

  // Activity Summary
  summary: {
    resourcesGathered: {
      [resourceId: string]: number;
    };
    budsEncountered: number;
    budsCaptured: number;
    combatVictories: number;
    tasksCompleted: number;
    rareLootFound: number;
    consumablesSpent: number;
    healingReceived: number;
  };
}

```
### Hunter

```TypeScript

interface CharacterSave {
  // Character Metadata
  id: string;
  name: string;
  createdAt: Date;
  lastPlayed: Date;
  playTime: number;
  gameMode: GameMode;

  // Tamer Data
  tamer: {
    // Core Stats
    totalLevel: number;
    totalExperience: number;
    stats: {
      health: number;
      attack: number;
      defense: number;
      speed: number;
      stamina: number;
    };
    
    // Currently Active Task (only one at a time)
    currentActivity?: {
      type: TaskType;
      startedAt: Date;
      location: {
        regionId: string;
        areaId: string;
        nodeId: string;
        nodeTier: number;
      };
      
      // Currently used tool/weapon for task
      activeToolId?: string;
      
      details: {
        // For Combat
        combat?: {
          activeBuds: string[];
          targetId?: string;
          autoEat: boolean;
          healThreshold: number;
        };
        
        // For Gathering
        gathering?: {
          type: GatheringType;
          resourceType: string;
          assistingBudId?: string;
          efficiency: number;
        };
        
        // For Crafting
        crafting?: {
          type: CraftingType;
          recipe: string;
          progress: number;
          assistingBudId?: string;
          requiredResources: {
            [resourceId: string]: number;
          };
        };
      };
    };
    
    // Skills
    skills: {
      [skillName: string]: {
        level: number;
        experience: number;
        masteryLevel: number;
        masteryExperience: number;
      };
    };
  };

  // Equipment & Tools
  equipment: {
    // Worn Equipment
    head?: string;
    body?: string;
    legs?: string;
    feet?: string;
    neck?: string;
    ring?: string;
  };
  
  // Tools for different activities
  tools: {
    [toolType: string]: string; // toolType -> ItemId mapping
  };
  
  // Inventory Systems
  inventory: {
    [itemId: string]: number;  // Carried items
  };
  bank: {
    [itemId: string]: number;  // Stored items
  };

```

### Buds

```TypeScript
// Bud Status Types
type BudStatus = 'stored' | 'assigned' | 'party';

// Task Types
type BudTaskType = 
  | 'watering'
  | 'planting'
  | 'fishing'
  | 'crafting'
  | 'smelting'
  | 'smithing'
  | 'lumbering'
  | 'mining'
  | 'combat';

interface BudCollection {
  [budId: string]: BudData;
}

interface BudData {
  // Core Data & Metadata
  speciesId: string;
  id: string;
  name: string;
  nickname?: string; // default as name
  level: number;
  experience: number;
  primaryAffinity: 'fire' | 'grass' | 'ground' | 'electric' | 'water';
  secondaryAffinity?:'fire' | 'grass' | 'ground' | 'electric' | 'water';
  gender: 'male' | 'female' | 'none';
  palette: 'normal' | 'spring' | 'summer' | 'fall' | 'winter' |;
  isShiny: boolean;
  spriteRef: string;
  hatchDate: Date;
  tamerId: string;
  primaryPassive: string;
  secondaryPassive: string;
  
  // Current Status
  status: BudStatus;
  
  // Stats
  stats: {
    maxHealth: number;
    currentHealth: number;
	intuition: number;
    attack: number;
    defense: number;
    dexterity: number;
  };
  
  // Intrinsic Values
  ivs: {
    health: number;
    intuition: number;
    attack: number;
    defense: number;
    dexterity: number;
  };
  
 // Passion 
 // Efficiency multiplier, 0 = wont do
  passion: {
      aquatics: number; // 0-5
      kindling: number;
      gathering: number;
      handiwork: number;
      combat: number;
      mysticism: number;
  };
  
  // Current Assignment
  assignment?: {
    type: BudTaskType;
    location: string;
    startedAt: Date;
    efficiency: number; // what is this?
    structureId?: string;
  };

  // Combat Related
  moves: {
    normal: string[];
    special: string;
  };
}

// Party Management
interface TamerParty {
  activeParty: string[]; // Array of budIds, max 5
  partyLeader?: string; // budId of party leader
}


```
``

### Settings
```TypeScript
interface GameSettings {
  // Display Settings
  display: {
    theme: Theme;
    showToolTips: boolean;
    showTaskNotifications: boolean;
  };

  // Audio Settings
  audio: {
    masterVolume: number; // 0-100
    musicEnabled: boolean;
    musicVolume: number;
    sfxEnabled: boolean;
    sfxVolume: number;
  };

  // Gameplay Settings
  gameplay: {
    combatWhileAFK: boolean;
    autoPause: boolean;
    autoEat: boolean; // unlockable
    autoPotion: boolean; // unlockable
    autoLootAll: boolean; // unlockable
    autoEquipFood: boolean; // unlockable?
  };


  // Notification Settings
  notifications: {
    enableDesktopNotifications: boolean;
    showCombatNotifications: boolean;
    showLootNotifications: boolean;
    showSkillNotifications: boolean;
    showBudCaptureNotifications: boolean;
    notifyOnFullInventory: boolean;
  };
}
```

## Game Level
### Game Rules
```TypeScript
// Core Types
type Stats = {
  health: number;
  attack: number;
  defense: number;
  speed: number;
  stamina: number;
};

type AffinityType = 'water' | 'fire' | 'ground' | 'electric' | 'grass';
type TaskType = 'watering' | 'planting' | 'fishing' | 'crafting' | 'smelting' | 'smithing' | 'lumbering' | 'mining' | 'combat';
type Tier = 1 | 2 | 3 | 4 | 5 | 6;

interface GameRules {
  // Core Systems
  progression: {
    maxLevel: number;
    experienceTable: number[];
    combatLevelFormula: (stats: Stats) => number;
    
    unlockRequirements: {
      [tier in Tier]: {
        tamerLevel: number;
        toolRequirements: string[];
      };
    };
  };

  // Affinity System
  affinities: {
    [affinity in AffinityType]: {
      primaryTasks: TaskType[];
      combatStrengths: AffinityType[];
      combatWeaknesses: AffinityType[];
      statBonuses: Partial<Stats>;
      taskEfficiencyBonus: number;
    };
  };

  // Resource System
  resourceTiers: {
    [resourceId: string]: {
      tier: Tier;
      requiredLevel: number;
      toolRequired: string;
      baseYield: number;
      staminaCost: number;
      speedRequirement: number;
      respawnTime: number;
      validAffinities: AffinityType[];
      
      specialProperties: {
        criticalYieldChance: number;
        bonusResourceChance: number;
        experienceModifier: number;
        rareMaterialChance: number;
      };
    };
  };

  // Tool System
  tools: {
    [toolId: string]: {
      tier: Tier;
      requiredLevel: number;
      materials: Record<string, number>;
      efficiency: number;
      staminaUsage: number;
      durability: number;
      
      bonuses: {
        resourceYield: number;
        experienceGain: number;
        criticalChance: number;
        staminaReduction: number;
      };
    };
  };

  // Bud Work System
  budWork: {
    calculateEfficiency: (
      stats: Stats,
      task: TaskType,
      passion: number,
      affinity: AffinityType
    ) => {
      baseEfficiency: number;
      staminaModifier: number;
      passionBonus: number;
      affinityBonus: number;
      totalEfficiency: number;
    };

    passionSystem: {
      baseMultipliers: {
        1: 1.0,  // No bonus
        2: 1.2,  // Small bonus
        3: 1.4,  // Medium bonus
        4: 1.6,  // Large bonus
        5: 2.0   // Master bonus
      };
      staminaCosts: {
        1: 1.2,  // Higher cost
        2: 1.1,
        3: 1.0,
        4: 0.9,
        5: 0.8   // Lower cost
      };
    };

    taskRequirements: {
      [task in TaskType]: {
        minimumLevel: number;
        requiredTool?: string;
        staminaCost: number;
        baseSpeed: number;
        preferredAffinity: AffinityType;
      };
    };
  };

  // Combat System
  combat: {
    maxPartySize: number;
    partyLeaderBonus: number;
    
    calculateDamage: (
      attacker: Stats,
      defender: Stats,
      moveType: string,
      affinity: AffinityType
    ) => {
      damage: number;
      speedPriority: number;
      staminaCost: number;
      criticalChance: number;
      effects: string[];
    };

    moveTypes: {
      normal: {
        staminaCost: number;
        basePower: number;
        criticalRate: number;
      };
      special: {
        staminaCost: number;
        basePower: number;
        criticalRate: number;
        chargeTime: number;
      };
    };

    statusEffects: {
      [effect: string]: {
        duration: number;
        statModifiers: Partial<Stats>;
        tickDamage?: number;
        healingRate?: number;
      };
    };
  };

  // Catching System
  catching: {
    ballTypes: {
      [ballType: string]: {
        tier: Tier;
        baseRate: number;
        affinityBonus: number;
        speedModifier: number;
        staminaCost: number;
        materials: Record<string, number>;
        specialEffects: {
          healthBonus?: number;
          statBoosts?: Partial<Stats>;
          passionBonus?: number;
        };
      };
    };
    
    calculateCatchRate: (
      budStats: Stats,
      ballType: string,
      currentHealth: number,
      conditions: {
        isAsleep?: boolean;
        isWeakened?: boolean;
        affinityMatch?: boolean;
        weatherBonus?: number;
      }
    ) => {
      baseRate: number;
      finalRate: number;
      criticalChance: number;
      bonusEffects: string[];
    };
  };
}


```
### Spawning

```TypeScript
type Affinity = 'fire' | 'grass' | 'ground' | 'electric' | 'water';
type PassionType = 'aquatics' | 'kindling' | 'lumbering' | 'mining' | 'handiwork';
type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';
type Season = 'spring' | 'summer' | 'fall' | 'winter';

interface SpawnSystem {
  // Core Spawn Rules
  spawnRules: {
    [areaId: string]: {
      // Basic Area Properties
      name: string;
      requiredLevel: number;
      unlockRequirements: {
        tamerLevel: number;
        itemsRequired: string[];
        questsRequired: string[];
        previousAreas: string[];
      };
      
      // Spawn Configuration
      spawnTable: {
        [speciesId: string]: {
          weight: number;
          levelRange: {
            min: number;
            max: number;
          };
          baseStats: {
            health: number;
            attack: number;
            defense: number;
            speed: number;
            stamina: number;
          };
          affinities: {
            primary: Affinity;
            secondary?: Affinity;
          };
          passions: {
            [key in PassionType]: {
              min: number;
              max: number;
            };
          };
          moves: {
            normal: string[];
            special: string[];
          };
          passives: {
            primary: string[];    // Possible primary passives
            secondary: string[];  // Possible secondary passives
          };
          rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'mythical';
          timeConditions?: TimeOfDay[];
          seasonalPalette?: Season[];
          shinyChance: number;
        };
      };
      
      // Special Variant Spawns
      variantSpawns: {
        [speciesId: string]: {
          chance: number;
          conditions: {
            minTamerLevel: number;
            timeOfDay?: TimeOfDay[];
            season?: Season[];
            previousCaptures?: string[];
          };
          guaranteedStats?: Partial<{
            health: number;
            attack: number;
            defense: number;
            speed: number;
            stamina: number;
          }>;
          guaranteedPassions?: Partial<{
            [key in PassionType]: number;
          }>;
          guaranteedPalette?: Season;
          guaranteedPassives?: {
            primary?: string;
            secondary?: string;
          };
        };
      };
      
      // Boss Configuration
      areaBoss?: {
        speciesId: string;
        level: number;
        fixedStats: {
          health: number;
          attack: number;
          defense: number;
          speed: number;
          stamina: number;
        };
        fixedPassions: {
          [key in PassionType]: number;
        };
        fixedPassives: {
          primary: string;
          secondary: string;
        };
        guaranteedDrops: string[];
        specialMechanics: string[];
      };
    };
  };

  calculateSpawn: (
    areaId: string,
    tamerLevel: number,
    conditions: {
      time: TimeOfDay;
      season: Season;
      killCount: number;
    }
  ) => {
    speciesId: string;
    name: string;
    level: number;
    primaryAffinity: Affinity;
    secondaryAffinity?: Affinity;
    stats: {
      maxHealth: number;
      attack: number;
      defense: number;
      speed: number;
      stamina: number;
    };
    ivs: {
      health: number;
      attack: number;
      defense: number;
      speed: number;
      stamina: number;
    };
    passion: {
      aquatics: number;
      kindling: number;
      lumbering: number;
      mining: number;
      handiwork: number;
    };
    moves: {
      normal: string[];
      special: string;
    };
    primaryPassive: string;
    secondaryPassive: string;
    palette: 'normal' | Season;
    isShiny: boolean;
    isBoss: boolean;
  };
}
```

### Resources

```TypeScript
// Resource Node Interfaces
interface ResourceNode {
  id: string;
  type: 'tree' | 'ore' | 'fish' | 'plant';
  tier: number;
  requiredLevel: number;
  baseYield: number;
  respawnTime: number;
  currentState: {
    isAvailable: boolean;
    lastHarvested?: Date;
    assignedBudId?: string;
  };
}
```

### Location Management

```TypeScript
// Area/Location Management
interface GameArea {
  id: string;
  name: string;
  requiredLevel: number;
  unlocked: boolean;
  nodes: ResourceNode[];
  availableBuds: string[]; // speciesIds
  boss?: {
    speciesId: string;
    defeated: boolean;
    respawnTime: number;
  };
}
```



### Quest/Achievement System

```TypeScript
// Quest/Achievement System
interface Quest {
  id: string;
  type: 'main' | 'daily' | 'achievement';
  requirements: {
    budsCollected?: string[];
    resourcesGathered?: Record<string, number>;
    levelsReached?: Record<string, number>;
    bossesDefeated?: string[];
  };
  rewards: {
    experience: number;
    items: Record<string, number>;
    unlocks?: string[];
  };
  progress: number;
  completed: boolean;
}
```

### Inventory Management

```TypeScript
// Inventory Management
interface InventorySystem {
  maxSlots: number;
  equipped: {
    [slot: string]: ItemData;
  };
  items: {
    [itemId: string]: {
      quantity: number;
      quality?: number;
      durability?: number;
    };
  };
}
```

### Items
```TypeScript
// Base Item Interface
interface BaseItem {
  id: string;
  name: string;
  description: string;
  tier: number;
  value: number;
  isStackable: boolean;
  maxStackSize: number;
}

// Ball Interface
interface BallItem extends BaseItem {
  type: 'ball';
  catchRate: number;
  affinityBonus: number;
  speedModifier: number;
  staminaCost: number;
  specialEffects?: {
    healthBonus?: number;
    statBoosts?: Partial<Stats>;
    passionBonus?: number;
  };
  materials: Record<string, number>;
}

// Armor Interface
interface ArmorItem extends BaseItem {
  type: 'armor';
  slot: 'head' | 'body' | 'legs' | 'feet' ;
  stats: {
    health: number;
    defense: number;
    speed: number;
    stamina: number;
  };
  durability: {
    current: number;
    max: number;
  };
  requirements: {
    level: number;
    skills?: Record<string, number>;
  };
  affinityBonus?: string;
}

// Weapon Interface
interface WeaponItem extends BaseItem {
  type: 'weapon';
  slot: 'mainHand' | 'offHand';
  stats: {
    attack: number;
    speed: number;
    stamina: number;
  };
  durability: {
    current: number;
    max: number;
  };
  requirements: {
    level: number;
    skills?: Record<string, number>;
  };
  affinityBonus?: string;
}

// Tool Interface
interface ToolItem extends BaseItem {
  type: 'tool';
  toolType: 'axe' | 'pickaxe' | 'fishingRod' ;
  efficiency: number;
  staminaUsage: number;
  durability: {
    current: number;
    max: number;
  };
  bonuses: {
    resourceYield: number;
    experienceGain: number;
    criticalChance: number;
    staminaReduction: number;
  };
  requirements: {
    level: number;
    skills?: Record<string, number>;
  };
}

// Consumable Interface
interface ConsumableItem extends BaseItem {
  type: 'consumable';
  category: 'food' | 'potion' | 'medicine';
  effects: {
    type: 'heal' | 'buff' | 'cure' | 'energy';
    value: number;
    duration?: number; // in seconds
    target: 'tamer' | 'bud' | 'both';
  }[];
  cooldown: number; // in seconds
  useTime: number; // in seconds
}

// Material Interface
interface MaterialItem extends BaseItem {
  type: 'material';
  category: 'wood' | 'ore' | 'metal' | 'gem' | 'fiber' | 'crystal' | 'component';
  quality?: number; // 0-100
  source: {
    type: 'gathering' | 'crafting' | 'combat' | 'quest';
    location?: string;
    requiredLevel?: number;
  };
  usedIn: string[]; // IDs of recipes that use this material
}

// Type union for all items
type GameItem = 
  | BallItem 
  | ArmorItem 
  | WeaponItem 
  | ToolItem 
  | ConsumableItem 
  | MaterialItem;

```
### Combat System State
```TypeScript
// Combat System State
interface CombatState {
  inCombat: boolean;
  currentEncounter?: {
    enemyBuds: BudData[];
    activeBuds: string[];
    turn: number;
    autoMode: boolean;
    healThreshold: number;
  };
  autoSettings: {
    enabled: boolean;
    healAt: number;
    useSpecialAt: number;
    preferredBalls: string[];
  };
```

### Crafting System
```TypeScript
// Recipe Types
type RecipeType = 'ball' | 'armor' | 'weapon' | 'tool' | 'consumable' | 'material';
type CraftingStation = 'workbench' | 'forge' | 'kitchen' | 'laboratory' | 'assemblyTable';

interface CraftingSystem {
  // Recipe Definitions
  recipes: {
    [recipeId: string]: {
      // Core Recipe Data
      name: string;
      description: string;
      type: RecipeType;
      tier: number;
      
      // Requirements
      requiredLevel: number;
      requiredStation: CraftingStation;
      requiredTools?: string[];
      
      // Materials and Yields
      materials: Record<string, number>;
      catalysts?: Record<string, number>; // Optional materials that aren't consumed
      
      // Crafting Process
      craftingTime: number; // in seconds
      experienceGained: number;
      skillType: string;
      
      // Output
      output: {
        itemId: string;
        baseQuantity: number;
        qualityRange: {
          min: number;
          max: number;
        };
      };
      
      // Bonus Outputs
      bonusOutputs?: {
        [itemId: string]: {
          chance: number;
          quantity: number;
        };
      };
      
      // Special Requirements
      unlockConditions?: {
        questsRequired?: string[];
        achievementsRequired?: string[];
        previousRecipes?: string[];
      };
    };
  };

  // Crafting Stations
  stations: {
    [stationType in CraftingStation]: {
      tier: number;
      requiredLevel: number;
      allowedRecipeTypes: RecipeType[];
      efficiency: number;
      maxQueueSize: number;
      bonuses: {
        speedMultiplier: number;
        qualityBonus: number;
        resourceSaving: number;
        bonusChance: number;
      };
    };
  };

  // Quality Calculation
  calculateQuality: (
    recipe: string,
    materialQualities: Record<string, number>,
    crafterLevel: number,
    stationType: CraftingStation,
    budAssisting?: {
      passion: number;
      efficiency: number;
    }
  ) => {
    baseQuality: number;
    bonusQuality: number;
    finalQuality: number;
  };

  // Crafting Queue
  queue: {
    [stationType in CraftingStation]: {
      currentRecipe?: {
        recipeId: string;
        progress: number;
        startedAt: Date;
        assignedBudId?: string;
      };
      pendingRecipes: string[];
    };
  };
}
```

### Shop

```TypeScript
type Currency = 'gold' | 'premium' | 'event';
type ShopCategory = 'balls' | 'tools' | 'consumables' | 'materials' | 'upgrades' | 'special';
type RestockPeriod = 'never' | 'daily' | 'weekly' | 'monthly';

interface ShopSystem {
  // Core Shop Configuration
  shops: {
    [shopId: string]: {
      name: string;
      description: string;
      category: ShopCategory;
      currency: Currency;
      unlockRequirements: {
        tamerLevel: number;
        questsRequired?: string[];
        itemsRequired?: string[];
      };
      
      // Stock Management
      inventory: {
        [itemId: string]: {
          basePrice: number;
          currentPrice: number;
          quantity: number;
          maxQuantity?: number;
          restockPeriod: RestockPeriod;
          restockAmount: number;
          lastRestock?: Date;
          
          // Purchase Requirements
          requirements?: {
            tamerLevel?: number;
            reputation?: number;
            questComplete?: string[];
          };
          
          // Sale Properties
          discount?: {
            amount: number;
            endTime: Date;
          };
          
          // Limited Time Items
          availability?: {
            startDate: Date;
            endDate: Date;
            isSeasonalItem: boolean;
          };
        };
      };
      
      // Dynamic Pricing
      pricingRules?: {
        supplyMultiplier: number;
        demandMultiplier: number;
        minPrice: number;
        maxPrice: number;
        priceChangeInterval: number;
      };
    };
  };

  // Special Shops
  rotatingStock: {
    daily: {
      items: string[];
      lastRefresh: Date;
      nextRefresh: Date;
    };
    weekly: {
      items: string[];
      lastRefresh: Date;
      nextRefresh: Date;
    };
  };

  // Reputation System
  reputation: {
    [shopId: string]: {
      currentLevel: number;
      experience: number;
      discountRate: number;
      specialStock: string[];
    };
  };

  // Trading System
  trading: {
    materialExchange: {
      [materialId: string]: {
        baseValue: number;
        currentValue: number;
        exchangeRate: number;
        minPrice: number;
        maxPrice: number;
      };
    };
    
    // Special Exchanges
    specialTrades: {
      [tradeId: string]: {
        input: Record<string, number>;
        output: Record<string, number>;
        limitPerDay?: number;
        timesTraded: number;
        resetTime: Date;
      };
    };
  };

  // Shop Functions
  calculatePrice: (
    itemId: string,
    quantity: number,
    shopId: string,
    reputation: number
  ) => {
    basePrice: number;
    discount: number;
    finalPrice: number;
    currency: Currency;
  };

  canPurchase: (
    itemId: string,
    quantity: number,
    shopId: string,
    playerState: any
  ) => {
    canBuy: boolean;
    reason?: string;
  };

  // Shop Events
  events: {
    [eventId: string]: {
      name: string;
      startDate: Date;
      endDate: Date;
      discountRate: number;
      specialItems: string[];
      requirements?: {
        tamerLevel: number;
        questComplete?: string[];
      };
    };
  };
}
```
### Time and Weather (Do Not Implement Yet)

```TypeScript
// Time & Environment Types
type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';
type Season = 'spring' | 'summer' | 'fall' | 'winter';
type Weather = 'clear' | 'rain' | 'storm' | 'snow';

interface EnvironmentSystem {
  // Time System
  time: {
    current: TimeOfDay;
    cycleLength: number; // in minutes
    timeMultiplier: number; // for speeding up/slowing down
    
    // Dawn: 0-5, Day: 6-17, Dusk: 18-19, Night: 20-23
    phases: {
      [phase in TimeOfDay]: {
        start: number;
        end: number;
        bonuses: {
          spawns?: string[];
          efficiency?: number;
          catchRate?: number;
        };
      };
    };
  };

  // Season System
  season: {
    current: Season;
    seasonLength: number; // in days
    
    effects: {
      [season in Season]: {
        resourceModifiers: Record<string, number>;
        spawnRates: Record<string, number>;
        weatherChances: Record<Weather, number>;
        budPalettes: string[]; // Available seasonal variants
      };
    };
  };

  // Weather System
  weather: {
    current: Weather;
    minDuration: number; // in minutes
    maxDuration: number;
    
    effects: {
      [condition in Weather]: {
        efficiency: number; // Global efficiency modifier
        spawns: string[]; // Special weather spawns
        restrictions: string[]; // Disabled activities
        bonuses: {
          catchRate?: number;
          resourceYield?: number;
          expGain?: number;
        };
      };
    };
  };
}
```



# Time
## Ticks
Melvor Idle uses 20 ticks per second