import { budBase } from "./budBase.types";

export interface budInstance extends budBase {
    id: string;
    nickname?: string;
    level: number;
    experience: number;
    gender: 'male' | 'female' | 'none';
    // palette: 'normal' | 'spring' | 'summer' | 'fall' | 'winter';
    // isShiny: boolean;
    // hunterId?: string; // Optional for wild Buds
    // hatchDate?: Date; // Optional for wild Buds
    // // status: BudStatus;
    // ivs: {
    //   health: number;
    //   wisdom: number;
    //   attack: number;
    //   defense: number;
    //   dexterity: number;
    // };
    // passion: {
    //   aquatics: number; // 0-5
    //   kindling: number;
    //   gathering: number;
    //   handiwork: number;
    //   combat: number;
    //   mysticism: number;
    // };
    // assignment?: {
    //   type: BudTaskType;
    //   location: string;
    //   startedAt: Date;
    //   efficiency: number;
    //   structureId?: string;
    // };
  }