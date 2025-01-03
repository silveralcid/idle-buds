import { WorkbenchType } from "../enums/workbenchType.enum";
import { Recipe } from "../types/recipe.types";
import { meleeRecipes } from "./recipes/meleeRecipes.data";
import { smeltedRecipes } from "./recipes/smeltedRecipes.data";
import { armorRecipes } from "./recipes/armorRecipes.data";


// Dynamically import and aggregate all recipes
export const recipeRegistry: Recipe[] = [
  ...meleeRecipes,
  ...smeltedRecipes,
  ...armorRecipes,
];

// Utility to filter recipes by workbench type
export const getRecipesByWorkbench = (workbenchType: WorkbenchType): Recipe[] => {
    return recipeRegistry.filter((recipe) => recipe.workbenchType === workbenchType);
  };

  
