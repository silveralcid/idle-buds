import { Recipe } from '../types/recipe.types';
import { useBankStore } from '../stores/bank.store';
import { useHunterStore } from '../stores/hunter.store';
import { GameConfig } from '../constants/gameConfig';
import { calculateResourceGain } from './resourceCalculation.utils';

export const processCrafting = (recipe: Recipe, deltaTime: number, fractionalProgress: number = 0) => {
  console.log('Processing craft:', {
    recipe: recipe.name,
    deltaTime,
    fractionalProgress
  });

  const bankStore = useBankStore.getState();
  const hunterStore = useHunterStore.getState();

  // Calculate progress based on time
  const ticks = deltaTime / GameConfig.tickDuration;
  const { wholeAmount: completedCrafts, newFraction } = calculateResourceGain(
    1 / recipe.craftingTime,
    ticks,
    fractionalProgress
  );

  console.log('Craft progress:', {
    completedCrafts,
    newFraction
  });

  // If no completed crafts, return progress
  if (completedCrafts === 0) {
    return {
      success: true,
      fractionalProgress: newFraction,
      completed: false
    };
  }

  // Check if we have required items
  const hasItems = recipe.inputs.every(input =>
    input.itemIds.some(itemId =>
      (bankStore.items[itemId] || 0) >= input.amount
    )
  );

  if (!hasItems) {
    return {
      success: false,
      fractionalProgress: 0,
      completed: false
    };
  }

  // Remove input items
  recipe.inputs.forEach(input => {
    const availableItemId = input.itemIds.find(itemId =>
      (bankStore.items[itemId] || 0) >= input.amount
    );
    if (availableItemId) {
      bankStore.removeItem(availableItemId, input.amount);
    }
  });

  // Add output items
  recipe.outputs.forEach(output => {
    bankStore.addItem(output.itemId, output.amount);
  });

  // Add experience
  hunterStore.increaseSkillExperience('smithing', recipe.experienceGain);

  return {
    success: true,
    fractionalProgress: newFraction,
    completed: true
  };
};