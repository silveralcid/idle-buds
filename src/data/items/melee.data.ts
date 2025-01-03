import { equipmentItem } from "../../types/equipment.types";
import { SlotType } from "../../enums/equipmentSlotType.enums";

export const melee: equipmentItem[] = [
  {
    id: "copper_dagger",
    name: "Copper Dagger",
    type: 'equipment',
    tier: 1,
    description: "A simple dagger forged from copper. Lightweight and easy to use.",
    rarity: "common",
    value: 10,
    isStackable: false,
    tags: ["weapon", "melee", "dagger"],
    slot: "1h-weapon",
    affinity: null,
    isEquipped: false,
    damageType: 'melee',
    
    requirements: {
      level: 1,
      attributes: {
        attack: 5
      }
    },

    stats: {
      attack: 2,
      dexterity: 1
    },

    statRanges: {
      attackInterval: [1.8, 2.2],
      meleeDamage: [2, 4]
    }
  },
  {
    id: "bronze_dagger",
    name: "Bronze Dagger",
    type: 'equipment',
    tier: 1,
    description: "A simple dagger forged from bronze. Lightweight and easy to use.",
    rarity: "common",
    value: 10,
    isStackable: false,
    tags: ["weapon", "melee", "dagger"],
    slot: "1h-weapon",
    affinity: null,
    isEquipped: false,
    damageType: 'melee',
    
    requirements: {
      level: 1,
      attributes: {
        attack: 5
      }
    },

    stats: {
      attack: 2,
      dexterity: 1
    },

    statRanges: {
      attackInterval: [1.8, 2.2],
      meleeDamage: [2, 4]
    }
  },
  {
    id: "iron_dagger",
    name: "Iron Dagger",
    type: 'equipment',
    tier: 2,
    description: "A sturdy dagger made of iron. Reliable for close combat.",
    rarity: "common",
    value: 20,
    isStackable: false,
    tags: ["weapon", "melee", "dagger"],
    slot: "1h-weapon",
    affinity: null,
    isEquipped: false,
    damageType: 'melee',
    
    requirements: {
      level: 5,
      attributes: {
        attack: 10
      }
    },

    stats: {
      attack: 4,
      dexterity: 2
    },

    statRanges: {
      attackInterval: [1.7, 2.1],
      meleeDamage: [4, 7]
    }
  },
  {
    id: "steel_dagger",
    name: "Steel Dagger",
    type: 'equipment',
    tier: 3,
    description:
      "A finely crafted steel dagger. Offers a balance of sharpness and durability.",
    rarity: "uncommon",
    value: 40,
    isStackable: false,
    tags: ["weapon", "melee", "dagger"],
    slot: "1h-weapon",
    affinity: null,
    isEquipped: false,
    damageType: 'melee',
    
    requirements: {
      level: 10,
      attributes: {
        attack: 15
      }
    },

    stats: {
      attack: 6,
      dexterity: 3
    },

    statRanges: {
      attackInterval: [1.6, 2],
      meleeDamage: [6, 10]
    }
  },
  {
    id: "mithril_dagger",
    name: "Mithril Dagger",
    type: 'equipment',
    tier: 4,
    description:
      "A lightweight dagger forged from mithril. Ideal for swift strikes.",
    rarity: "rare",
    value: 80,
    isStackable: false,
    tags: ["weapon", "melee", "dagger"],
    slot: "1h-weapon",
    affinity: null,
    isEquipped: false,
    damageType: 'melee',
    
    requirements: {
      level: 15,
      attributes: {
        attack: 20
      }
    },

    stats: {
      attack: 8,
      dexterity: 4
    },

    statRanges: {
      attackInterval: [1.5, 1.9],
      meleeDamage: [8, 14]
    }
  },
  {
    id: "adamantite_dagger",
    name: "Adamantite Dagger",
    type: 'equipment',
    tier: 5,
    description:
      "A razor-sharp dagger made of adamantite. Known for its exceptional durability.",
    rarity: "epic",
    value: 150,
    isStackable: false,
    tags: ["weapon", "melee", "dagger"],
    slot: "1h-weapon",
    affinity: null,
    isEquipped: false,
    damageType: 'melee',
    
    requirements: {
      level: 20,
      attributes: {
        attack: 25
      }
    },

    stats: {
      attack: 10,
      dexterity: 5
    },

    statRanges: {
      attackInterval: [1.4, 1.8],
      meleeDamage: [10, 18]
    }
  },
  {
    id: "runite_dagger",
    name: "Runite Dagger",
    type: 'equipment',
    tier: 6,
    description:
      "A legendary dagger forged from runite. Perfect for high-tier warriors.",
    rarity: "epic",
    value: 250,
    isStackable: false,
    tags: ["weapon", "melee", "dagger"],
    slot: "1h-weapon",
    affinity: null,
    isEquipped: false,
    damageType: 'melee',
    
    requirements: {
      level: 25,
      attributes: {
        attack: 30
      }
    },

    stats: {
      attack: 12,
      dexterity: 6
    },

    statRanges: {
      attackInterval: [1.3, 1.7],
      meleeDamage: [12, 22]
    }
  }
];