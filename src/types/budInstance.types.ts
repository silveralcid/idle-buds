import { budBase } from "./budBase.types";

// Define valid Bud assignments
export type BudAssignment = "party" | "box" | "mining" | "smithing" | "lumbering" | "farming" | null ;

// Define optional task tracking, similar to HunterTask
export type BudTask = {
    taskType: "resourceNode" | "workbench" | null;
    nodeID?: string; // ID of the node or workbench
    recipeId?: string;
};

export interface budInstance extends budBase {
    id: string;
    nickname?: string;
    level: number;
    experience: number;
    experienceToNextLevel: number;
    gender: "male" | "female" | "none";
    assignment?: BudAssignment;
    task?: BudTask;

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
  }