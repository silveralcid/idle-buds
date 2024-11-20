import { budBase } from '../../types/budBase.types';

export const budSpecies: budBase[] = [
  {
    speciesId: '001',
    name: 'Woodland Bud',
    description: 'A Bud that thrives in forested areas, adept at lumbering.',
    spriteRef: '/assets/sprites/buds/slice-2.png',
    allowedTasks: ['lumbering', 'mining'],
    primaryAffinity: 'grass',
    // Uncomment and fill in if needed
    // secondaryAffinity: 'ground',
    // baseStats: {
    //   health: 50,
    //   wisdom: 30,
    //   attack: 40,
    //   defense: 35,
    //   dexterity: 25,
    // },
    // moves: {
    //   normal: ['leaf_slash', 'bark_bash'],
    //   special: 'forest_fury',
    // },
    // primaryPassive: 'photosynthesis',
    // secondaryPassive: 'rooted',
  },
  // Add more species as needed
];