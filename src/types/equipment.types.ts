import { BaseItem } from "./itemBase.types";
import { AffinityType } from "../enums/affinityType.enums";
import { SlotType } from "../enums/equipmentSlotType.enums";


export interface equipmentItem extends BaseItem {
    type: 'equipment';
    slot: SlotType;
    affinity: null | AffinityType;
    requirements?: {
        level: number;
        skills?: Record<string, number>;
    };
    isEquipped: boolean;


    // Combat Stats
    damageType?: 'melee' | 'ranged' | 'magic';

    statRanges?: {

    // Offensive Stats
    atackInterval?: [number, number];
    meleeDamage?: [number, number];
    rangedDamage?: [number, number];
    magicDamage?: [number, number];

    // Defensive Stats

    meleeDefense?: [number, number];
    rangedDefense?: [number, number];
    magicDefense?: [number, number];
    damageReduction?: [number, number];

    }

    // Other Stats

    
}