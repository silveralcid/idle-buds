// src/enums/item.enums.ts
export enum ItemType {
  EQUIPMENT = 'EQUIPMENT',
  RESOURCE = 'RESOURCE',
  CONSUMABLE = 'CONSUMABLE',
  MATERIAL = 'MATERIAL',
  SPECIAL = 'SPECIAL'
}

export enum EquipmentType {
  WEAPON = 'WEAPON',
  ARMOR = 'ARMOR',
  SHIELD = 'SHIELD',
  TOOL = 'TOOL',
  ACCESSORY = 'ACCESSORY'
}

export enum WeaponType {
  MELEE = 'MELEE',
  RANGED = 'RANGED',
  MAGIC_STAFF = 'MAGIC_STAFF'
}

export enum ToolType {
  AXE = 'AXE',
  PICKAXE = 'PICKAXE',
  FISHING_ROD = 'FISHING_ROD',
  WATERING_CAN = 'WATERING_CAN',
  SMITHING_HAMMER = 'SMITHING_HAMMER'
}

export enum MaterialType {
  CRAFTING = 'CRAFTING',
  SMITHING = 'SMITHING',
  COOKING = 'COOKING',
  SPECIAL = 'SPECIAL'
}

export enum ConsumableType {
  FOOD = 'FOOD',
  POTION = 'POTION',
  BAIT = 'BAIT'
}

export enum EquipmentQuality {
  NORMAL = 'NORMAL',
  FINE = 'FINE',
  SUPERIOR = 'SUPERIOR',
  EXCEPTIONAL = 'EXCEPTIONAL',
  PERFECT = 'PERFECT'
}

export enum EquipmentSlot {
  MAIN_HAND = 'MAIN_HAND',
  OFF_HAND = 'OFF_HAND',
  BODY = 'BODY',
  ACCESSORY_1 = 'ACCESSORY_1',
  ACCESSORY_2 = 'ACCESSORY_2',
  TOOL = 'TOOL'
}