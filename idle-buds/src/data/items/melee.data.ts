import { BaseItem } from "../../types/itemBase.types";


export const melee: BaseItem[] = [
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
  }
];