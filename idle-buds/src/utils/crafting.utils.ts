import { Recipe } from '../types/recipe.types';
import { useBankStore } from '../stores/bank.store';
import { useHunterStore } from '../stores/hunter.store';

export const processCrafting = (recipe: Recipe, deltaTime: number) => {
  const bankStore = useBankStore.getState();
  const hunterStore = useHunterStore.getState();

  // Check if we have required items
  const hasItems = recipe.inputs.every(input =>
    input.itemIds.some(itemId =>
      (bankStore.items[itemId] || 0) >= input.amount
    )
  );

  if (!hasItems) {
    return false;
  }

  // Remove input items
  recipe.inputs.forEach(input => {
    // Find the first available item from alternatives
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

  return true;
};