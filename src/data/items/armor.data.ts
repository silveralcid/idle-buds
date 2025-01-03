import { equipmentItem } from "../../types/equipment.types";
import { SlotType } from "../../enums/equipmentSlotType.enums";

export const armor: equipmentItem[] = [
  // Copper Armor Set
  {
    id: "copper_helmet",
    name: "Copper Helmet",
    type: 'equipment',
    tier: 1,
    description: "A basic helmet forged from copper. Offers minimal protection.",
    rarity: "common",
    value: 15,
    isStackable: false,
    tags: ["armor", "metal", "helmet"],
    slot: "head",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 1,
      attributes: {
        defense: 5
      }
    },

    stats: {
      defense: 2,
      health: 1
    }
  },
  {
    id: "copper_chestplate",
    name: "Copper Chestplate",
    type: 'equipment',
    tier: 1,
    description: "A basic chestplate forged from copper. Provides basic protection.",
    rarity: "common",
    value: 25,
    isStackable: false,
    tags: ["armor", "metal", "body"],
    slot: "body",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 1,
      attributes: {
        defense: 5
      }
    },

    stats: {
      defense: 4,
      health: 2
    }
  },
  {
    id: "copper_legs",
    name: "Copper Legs",
    type: 'equipment',
    tier: 1,
    description: "Basic leg protection forged from copper.",
    rarity: "common",
    value: 20,
    isStackable: false,
    tags: ["armor", "metal", "legs"],
    slot: "legs",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 1,
      attributes: {
        defense: 5
      }
    },

    stats: {
      defense: 3,
      health: 2
    }
  },
  {
    id: "copper_boots",
    name: "Copper Boots",
    type: 'equipment',
    tier: 1,
    description: "Simple boots forged from copper.",
    rarity: "common",
    value: 10,
    isStackable: false,
    tags: ["armor", "metal", "feet"],
    slot: "feet",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 1,
      attributes: {
        defense: 5
      }
    },

    stats: {
      defense: 1,
      health: 1
    }
  },

  // Iron Armor Set
  {
    id: "iron_helmet",
    name: "Iron Helmet",
    type: 'equipment',
    tier: 2,
    description: "A sturdy helmet forged from iron.",
    rarity: "common",
    value: 30,
    isStackable: false,
    tags: ["armor", "metal", "helmet"],
    slot: "head",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 5,
      attributes: {
        defense: 10
      }
    },

    stats: {
      defense: 4,
      health: 2
    }
  },
  {
    id: "iron_chestplate",
    name: "Iron Chestplate",
    type: 'equipment',
    tier: 2,
    description: "A sturdy chestplate forged from iron.",
    rarity: "common",
    value: 50,
    isStackable: false,
    tags: ["armor", "metal", "body"],
    slot: "body",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 5,
      attributes: {
        defense: 10
      }
    },

    stats: {
      defense: 8,
      health: 4
    }
  },
  {
    id: "iron_legs",
    name: "Iron Legs",
    type: 'equipment',
    tier: 2,
    description: "Sturdy leg protection forged from iron.",
    rarity: "common",
    value: 40,
    isStackable: false,
    tags: ["armor", "metal", "legs"],
    slot: "legs",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 5,
      attributes: {
        defense: 10
      }
    },

    stats: {
      defense: 6,
      health: 3
    }
  },
  {
    id: "iron_boots",
    name: "Iron Boots",
    type: 'equipment',
    tier: 2,
    description: "Sturdy boots forged from iron.",
    rarity: "common",
    value: 20,
    isStackable: false,
    tags: ["armor", "metal", "feet"],
    slot: "feet",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 5,
      attributes: {
        defense: 10
      }
    },

    stats: {
      defense: 2,
      health: 1
    }
  },

  // Steel Armor Set (complete)
  {
    id: "steel_helmet",
    name: "Steel Helmet",
    type: 'equipment',
    tier: 3,
    description: "A well-crafted helmet forged from steel.",
    rarity: "uncommon",
    value: 60,
    isStackable: false,
    tags: ["armor", "metal", "helmet"],
    slot: "head",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 10,
      attributes: {
        defense: 15
      }
    },

    stats: {
      defense: 6,
      health: 3
    }
  },
  {
    id: "steel_chestplate",
    name: "Steel Chestplate",
    type: 'equipment',
    tier: 3,
    description: "A well-crafted chestplate forged from steel.",
    rarity: "uncommon",
    value: 100,
    isStackable: false,
    tags: ["armor", "metal", "body"],
    slot: "body",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 10,
      attributes: {
        defense: 15
      }
    },

    stats: {
      defense: 12,
      health: 6
    }
  },
  {
    id: "steel_legs",
    name: "Steel Legs",
    type: 'equipment',
    tier: 3,
    description: "Well-crafted leg protection forged from steel.",
    rarity: "uncommon",
    value: 80,
    isStackable: false,
    tags: ["armor", "metal", "legs"],
    slot: "legs",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 10,
      attributes: {
        defense: 15
      }
    },

    stats: {
      defense: 9,
      health: 4
    }
  },
  {
    id: "steel_boots",
    name: "Steel Boots",
    type: 'equipment',
    tier: 3,
    description: "Well-crafted boots forged from steel.",
    rarity: "uncommon",
    value: 40,
    isStackable: false,
    tags: ["armor", "metal", "feet"],
    slot: "feet",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 10,
      attributes: {
        defense: 15
      }
    },

    stats: {
      defense: 3,
      health: 2
    }
  },

  // Mithril Armor Set
  {
    id: "mithril_helmet",
    name: "Mithril Helmet",
    type: 'equipment',
    tier: 4,
    description: "A lightweight yet sturdy helmet forged from mithril.",
    rarity: "rare",
    value: 120,
    isStackable: false,
    tags: ["armor", "metal", "helmet"],
    slot: "head",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 15,
      attributes: {
        defense: 20
      }
    },

    stats: {
      defense: 8,
      health: 4
    }
  },
  {
    id: "mithril_chestplate",
    name: "Mithril Chestplate",
    type: 'equipment',
    tier: 4,
    description: "A lightweight yet sturdy chestplate forged from mithril.",
    rarity: "rare",
    value: 200,
    isStackable: false,
    tags: ["armor", "metal", "body"],
    slot: "body",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 15,
      attributes: {
        defense: 20
      }
    },

    stats: {
      defense: 16,
      health: 8
    }
  },
  {
    id: "mithril_legs",
    name: "Mithril Legs",
    type: 'equipment',
    tier: 4,
    description: "Lightweight yet sturdy leg protection forged from mithril.",
    rarity: "rare",
    value: 160,
    isStackable: false,
    tags: ["armor", "metal", "legs"],
    slot: "legs",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 15,
      attributes: {
        defense: 20
      }
    },

    stats: {
      defense: 12,
      health: 6
    }
  },
  {
    id: "mithril_boots",
    name: "Mithril Boots",
    type: 'equipment',
    tier: 4,
    description: "Lightweight yet sturdy boots forged from mithril.",
    rarity: "rare",
    value: 80,
    isStackable: false,
    tags: ["armor", "metal", "feet"],
    slot: "feet",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 15,
      attributes: {
        defense: 20
      }
    },

    stats: {
      defense: 4,
      health: 2
    }
  },

  // Adamantite Armor Set
  {
    id: "adamantite_helmet",
    name: "Adamantite Helmet",
    type: 'equipment',
    tier: 5,
    description: "An exceptionally durable helmet forged from adamantite.",
    rarity: "epic",
    value: 240,
    isStackable: false,
    tags: ["armor", "metal", "helmet"],
    slot: "head",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 20,
      attributes: {
        defense: 25
      }
    },

    stats: {
      defense: 10,
      health: 5
    }
  },
  {
    id: "adamantite_chestplate",
    name: "Adamantite Chestplate",
    type: 'equipment',
    tier: 5,
    description: "An exceptionally durable chestplate forged from adamantite.",
    rarity: "epic",
    value: 400,
    isStackable: false,
    tags: ["armor", "metal", "body"],
    slot: "body",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 20,
      attributes: {
        defense: 25
      }
    },

    stats: {
      defense: 20,
      health: 10
    }
  },
  {
    id: "adamantite_legs",
    name: "Adamantite Legs",
    type: 'equipment',
    tier: 5,
    description: "Exceptionally durable leg protection forged from adamantite.",
    rarity: "epic",
    value: 320,
    isStackable: false,
    tags: ["armor", "metal", "legs"],
    slot: "legs",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 20,
      attributes: {
        defense: 25
      }
    },

    stats: {
      defense: 15,
      health: 8
    }
  },
  {
    id: "adamantite_boots",
    name: "Adamantite Boots",
    type: 'equipment',
    tier: 5,
    description: "Exceptionally durable boots forged from adamantite.",
    rarity: "epic",
    value: 160,
    isStackable: false,
    tags: ["armor", "metal", "feet"],
    slot: "feet",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 20,
      attributes: {
        defense: 25
      }
    },

    stats: {
      defense: 5,
      health: 3
    }
  },

  // Runite Armor Set
  {
    id: "runite_helmet",
    name: "Runite Helmet",
    type: 'equipment',
    tier: 6,
    description: "A legendary helmet forged from runite.",
    rarity: "epic",
    value: 480,
    isStackable: false,
    tags: ["armor", "metal", "helmet"],
    slot: "head",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 25,
      attributes: {
        defense: 30
      }
    },

    stats: {
      defense: 12,
      health: 6
    }
  },
  {
    id: "runite_chestplate",
    name: "Runite Chestplate",
    type: 'equipment',
    tier: 6,
    description: "A legendary chestplate forged from runite.",
    rarity: "epic",
    value: 800,
    isStackable: false,
    tags: ["armor", "metal", "body"],
    slot: "body",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 25,
      attributes: {
        defense: 30
      }
    },

    stats: {
      defense: 24,
      health: 12
    }
  },
  {
    id: "runite_legs",
    name: "Runite Legs",
    type: 'equipment',
    tier: 6,
    description: "Legendary leg protection forged from runite.",
    rarity: "epic",
    value: 640,
    isStackable: false,
    tags: ["armor", "metal", "legs"],
    slot: "legs",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 25,
      attributes: {
        defense: 30
      }
    },

    stats: {
      defense: 18,
      health: 9
    }
  },
  {
    id: "runite_boots",
    name: "Runite Boots",
    type: 'equipment',
    tier: 6,
    description: "Legendary boots forged from runite.",
    rarity: "epic",
    value: 320,
    isStackable: false,
    tags: ["armor", "metal", "feet"],
    slot: "feet",
    affinity: null,
    isEquipped: false,
    
    requirements: {
      level: 25,
      attributes: {
        defense: 30
      }
    },

    stats: {
      defense: 6,
      health: 3
    }
  }
];
