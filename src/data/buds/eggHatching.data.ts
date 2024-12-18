import { EggHatchData } from '../../types/egg.types';

// Array of available species IDs
const availableSpecies = ['001', '002', '003'];

// Randomly select one species ID
const randomSpeciesId = availableSpecies[Math.floor(Math.random() * availableSpecies.length)];

export const eggHatchingData: EggHatchData[] = [
  {
    id: 'test_egg_hatch',
    name: 'Test Egg Hatch',
    description: 'A test egg used for hatching mechanics.',
    speciesId: randomSpeciesId,
    hatchDuration: 10, // In game ticks
    levelRequired: 1,
    experienceReward: 100,
    tier: 'common',
    requirements: {
      items: [
        {
          itemId: 'test_egg',
          amount: 1
        }
      ],
    },
    // discoveryLocation: 'Forest',
    // lore: 'A mysterious egg found in the forest. It seems to resonate with nature.',
    // affinityBoostMultiplier: 1.5,
    // incubatorBoostMultiplier: 1.2
  }
];
