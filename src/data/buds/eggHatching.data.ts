import { EggHatchData } from '../../types/egg.types';

// Array of available species IDs
const availableSpecies = ['001', '002', '003'];

// Randomly select one species ID
const randomSpeciesId = availableSpecies[Math.floor(Math.random() * availableSpecies.length)];

export const eggHatchingData: EggHatchData[] = [
    {
        id: 'poodoo_egg_hatch',
        name: 'Poodoo Egg Hatch',
        description: 'A Poodoo egg used for hatching mechanics.',
        speciesId: '001',
        hatchDuration: 10, // In game ticks
        levelRequired: 1,
        experienceReward: 100,
        tier: 'common',
        requirements: {
            items: [
                {
                    itemId: 'poodoo_egg',
                    amount: 1
                }
            ]
        }
    },
    {
        id: 'wach_egg_hatch',
        name: 'Wach Egg Hatch',
        description: 'A Wach egg used for hatching mechanics.',
        speciesId: '002',
        hatchDuration: 10, // In game ticks
        levelRequired: 1,
        experienceReward: 100,
        tier: 'common',
        requirements: {
            items: [
                {
                    itemId: 'wach_egg',
                    amount: 1
                }
            ]
        }
    },
    {
        id: 'fothy_egg_hatch',
        name: 'Fothy Egg Hatch',
        description: 'A Fothy egg used for hatching mechanics.',
        speciesId: '003',
        hatchDuration: 10, // In game ticks
        levelRequired: 1,
        experienceReward: 100,
        tier: 'common',
        requirements: {
            items: [
                {
                    itemId: 'fothy_egg',
                    amount: 1
                }
            ]
        }
    }
];
