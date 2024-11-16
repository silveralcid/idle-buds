export interface Tree {
    id: string;
    name: string;
    requiredLevel: number;
    xpPerCut: number;
    timeToChop: number; // in milliseconds
    resourceName: string;
  }
  