import { BaseItem } from "./itemBase.types";

export interface ConsumableEffect {
  type: 'heal' | 'buff';
  value: number;
  duration?: number; // Optional duration for buffs in ticks
}

export interface ConsumableItem extends BaseItem {
  type: 'consumable';
  effects: ConsumableEffect[];
  cooldown: number; // Cooldown in ticks before item can be used again
} 