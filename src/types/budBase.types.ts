export interface budBase {
  speciesId: string;
  name: string;
  description: string;
  spriteRef: string;
  allowedTasks: string[];
  primaryAffinity: 'fire' | 'water' | 'ground' | 'electric' | 'grass' | 'ice' | 'dragon' | 'dark' | 'neutral';
  // secondaryAffinity?: 'fire' | 'water' | 'ground' | 'electric' | 'grass' | 'ice' | 'dragon' | 'dark' | 'neutral';
  // baseStats: {
  //   health: number;
  //   wisdom: number;
  //   attack: number;
  //   defense: number;
  //   dexterity: number;
  // };
  // moves: {
  //   normal: string[];
  //   special: string;
  // };
  // primaryPassive: string;
  // secondaryPassive: string;
  baseStats: {
    health: number;
    intelligence: number;
    attack: number;
    defense: number;
    dexterity: number;
  };
  statsPerLevel: {
    health: number;
    intelligence: number;
    attack: number;
    defense: number;
    dexterity: number;
  };
}