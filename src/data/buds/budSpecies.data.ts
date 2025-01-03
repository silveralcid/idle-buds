import { budBase } from '../../types/budBase.types';

export const budSpecies: budBase[] = [
  {
    speciesId: '001',
    name: 'Poodoo',
    description: 'A Bud that thrives in forested areas, adept at lumbering.',
    spriteRef: '/assets/sprites/buds/slice-2.png',
    allowedTasks: ['lumbering', 'mining', 'smithing'],
    primaryAffinity: 'grass',
    baseStats: {
      health: 50,
      intelligence: 30,
      attack: 40,
      defense: 45,
      dexterity: 35,
    },
    statsPerLevel: {
      health: 5,
      intelligence: 2,
      attack: 3,
      defense: 4,
      dexterity: 2,
    },
  },
  {
    speciesId: '002',
    name: 'Wach',
    description: 'A Bud that thrives in forested areas, adept at lumbering.',
    spriteRef: '/assets/sprites/buds/slice-3.png',
    allowedTasks: ['lumbering', 'mining', 'smithing'],
    primaryAffinity: 'water',
    baseStats: {
      health: 45,
      intelligence: 45,
      attack: 35,
      defense: 40,
      dexterity: 35,
    },
    statsPerLevel: {
      health: 4,
      intelligence: 4,
      attack: 2,
      defense: 3,
      dexterity: 3,
    },
  },
  {
    speciesId: '003',
    name: 'Fothy',
    description: 'A Bud that thrives in forested areas, adept at lumbering.',
    spriteRef: '/assets/sprites/buds/slice-1.png',
    allowedTasks: ['lumbering', 'mining', 'smithing'],
    primaryAffinity: 'fire',
    baseStats: {
      health: 40,
      intelligence: 35,
      attack: 50,
      defense: 35,
      dexterity: 40,
    },
    statsPerLevel: {
      health: 3,
      intelligence: 2,
      attack: 5,
      defense: 2,
      dexterity: 4,
    },
  },
  // Add more species as needed
];