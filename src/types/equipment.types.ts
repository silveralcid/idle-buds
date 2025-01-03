import { BaseItem } from "./itemBase.types";
import { AffinityType } from "../enums/affinityType.enums";
import { SlotType } from "../enums/equipmentSlotType.enums";

export interface equipmentItem extends BaseItem {
    type: 'equipment';
    slot: SlotType;
    affinity: null | AffinityType;
    
    // Equipment Requirements
    requirements?: {
        // General requirements
        level: number;
        skills?: Record<string, number>;
        
        // Combat specific requirements
        combatLevel?: number;
        attributes?: {
            health?: number;
            intelligence?: number;
            attack?: number;
            defense?: number;
            dexterity?: number;
        };
    };
    
    isEquipped: boolean;

    // Combat Stats
    damageType?: 'melee' | 'ranged' | 'magic';

    // Base stat modifiers
    stats?: {
        health?: number;
        intelligence?: number;
        attack?: number;
        defense?: number;
        dexterity?: number;
    };

    // Combat specific ranges
    statRanges?: {
        // Offensive Stats
        attackInterval?: [number];
        meleeDamage?: [number, number];
        rangedDamage?: [number, number];
        magicDamage?: [number, number];

        // Defensive Stats
        meleeDefense?: [number];
        rangedDefense?: [number];
        magicDefense?: [number];
        damageReduction?: [number];
    }

    // Add food-specific properties
    consumableStats?: {
        healAmount?: number;
        duration?: number;
        cooldown?: number;
    };
}