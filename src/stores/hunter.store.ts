import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { BaseTask } from "../types/task.types";
import { Skill } from "../types/skill.types";
import { calculateExperienceRequirement } from "../utils/experience.utils";
import { GameEvents } from "../core/game-events/game-events";
import { GameConfig } from "../core/constants/game-config";
import { resourceRegistry } from "../data/resource-registry";
import { recipeRegistry } from "../data/recipe-registry";
import { useBankStore } from "./bank.store";

interface HunterState {
  hunterId: string; // Unique ID for the hunter
  currentTask: BaseTask | null; // Current task being performed
  progress: number; // Task progress as a percentage (0–100)
  hunterSkills: Record<string, Skill>; // Hunter's skill levels and experience
  loadState: (state: Partial<HunterState>) => void; // Load state from saved game
  resetHunterState: () => void; // Reset hunter state
}

interface HunterActions {
  startTask: (task: Omit<BaseTask, "ownerType" | "ownerId">) => void; // Assign a new task
  isWorking: boolean; // Tracks whether a task (gathering or crafting) is active
  stopTask: () => void; // Stop the current task
  updateTaskProgress: (ticks: number) => void; // Update task progress based on game ticks
  gainSkillXp: (skillId: string, xp: number) => void; // Gain XP for a skill
}

const gameEvents = GameEvents.getInstance();

export const useHunterStore = create<HunterState & HunterActions>((set, get) => {
  const hunterId = uuidv4();

  // Add listeners for pause/unpause events
  gameEvents.on("gamePaused", () => {
    console.log("Pausing tasks for hunter:", hunterId);
    set({ isWorking: false });
  });

  gameEvents.on("gameResumed", () => {
    const { currentTask } = get();
    if (currentTask) {
      console.log("Resuming tasks for hunter:", hunterId);
      set({ isWorking: true });
    }
  });

  // Subscribe to gameTick event for task progress updates
  gameEvents.on("gameTick", () => {
    const { currentTask, isWorking } = get();
    if (currentTask && isWorking) {
      get().updateTaskProgress(1); // Increment progress every tick
    }
  });

  const resetOrStopTask = () => {
    if (get().isWorking) {
      set({ progress: 0 });
    } else {
      set({ currentTask: null, progress: 0 });
      gameEvents.emit("hunterStateChanged", { hunterId: get().hunterId, newState: "idle" });
    }
  };

  const handleGatheringProgress = (ticks: number) => {
    const { currentTask } = get();
    if (!currentTask) return;

    const taskDefinition = resourceRegistry[currentTask.taskId];
    if (!taskDefinition) return;

    const progressIncrement = (ticks / (taskDefinition.gatherRate / GameConfig.TICK.DURATION)) * 100;
    const newProgress = Math.min(get().progress + progressIncrement, 100);

    if (newProgress === 100) {
      if (taskDefinition.resourceNodeYields.length > 0) {
        const itemId = taskDefinition.resourceNodeYields[0];
        const quantity = 1;

        useBankStore.getState().addItem(itemId, quantity);
        gameEvents.emit("resourceGathered", { name: itemId, quantity });
      }

      const xpGained = taskDefinition.experienceGain || 0;
      if (currentTask.skillId) {
        get().gainSkillXp(currentTask.skillId, xpGained);
        gameEvents.emit("hunterSkillXpGained", {
          hunterId: get().hunterId,
          skillName: currentTask.skillId,
          xpGained,
        });
      }

      resetOrStopTask();
      return;
    }

    set({ progress: newProgress });
  };

  const handleCraftingProgress = (ticks: number) => {
    const { currentTask } = get();
    if (!currentTask) return;

    const recipe = recipeRegistry.find((r) => r.id === currentTask.taskId);
    if (!recipe) return;

    const bankStore = useBankStore.getState();

    // Check for sufficient materials
    const hasMaterials = recipe.inputs.every((input) =>
      input.itemIds.some((id) => (bankStore.items[id] || 0) >= input.amount)
    );

    if (!hasMaterials) {
      // Stop task due to insufficient materials
      set({ isWorking: false, currentTask: null, progress: 0 });

      gameEvents.emit("hunterTaskCompleted", {
        hunterId: get().hunterId,
        task: currentTask.taskId,
        results: { success: false, reason: "Insufficient materials" },
      });

      gameEvents.emit("hunterStateChanged", {
        hunterId: get().hunterId,
        newState: "idle",
      });

      return;
    }

    // Calculate progress increment
    const progressIncrement = (ticks / recipe.craftingTime) * 100;
    const newProgress = Math.min(get().progress + progressIncrement, 100);

    if (newProgress === 100) {
      // Add outputs to the bank
      recipe.outputs.forEach((output) => {
        bankStore.addItem(output.itemId, output.amount);
      });

      // Remove inputs from the bank
      recipe.inputs.forEach((input) => {
        input.itemIds.forEach((id) => {
          bankStore.removeItem(id, input.amount);
        });
      });

      // Gain XP
      const xpGained = recipe.experienceGain || 0;
      if (currentTask.skillId) {
        get().gainSkillXp(currentTask.skillId, xpGained);

        gameEvents.emit("hunterSkillXpGained", {
          hunterId: get().hunterId,
          skillName: currentTask.skillId,
          xpGained,
        });
      }

      resetOrStopTask();
      return;
    }

    // Update progress if task is not yet complete
    set({ progress: newProgress });
  };

  return {
    hunterId,
    currentTask: null,
    progress: 0,
    isWorking: false,
    hunterSkills: {
      mining: {
        id: "mining",
        name: "Mining",
        level: 1,
        experience: 0,
        experienceToNextLevel: calculateExperienceRequirement("mining", 1),
      },
      smithing: {
        id: "smithing",
        name: "Smithing",
        level: 1,
        experience: 0,
        experienceToNextLevel: calculateExperienceRequirement("smithing", 1),
      },
      lumbering: {
        id: "lumbering",
        name: "Lumbering",
        level: 1,
        experience: 0,
        experienceToNextLevel: calculateExperienceRequirement("lumbering", 1),
      },
    },

    startTask: (task) => {
      const { isWorking, currentTask } = get();

      if (isWorking && currentTask?.taskId === task.taskId) {
        set({ isWorking: false, currentTask: null, progress: 0 });
        gameEvents.emit("hunterStateChanged", { hunterId, newState: "idle" });
        return;
      }

      const fullTask: BaseTask = {
        ...task,
        ownerType: "hunter",
        ownerId: hunterId,
      };

      set({ currentTask: fullTask, isWorking: true, progress: 0 });
      gameEvents.emit("hunterTaskAssigned", { hunterId, task: task.taskId });
      gameEvents.emit("hunterStateChanged", { hunterId, newState: "active" });
    },

    stopTask: () => {
      set({ isWorking: false, currentTask: null, progress: 0 });
      gameEvents.emit("hunterStateChanged", { hunterId, newState: "idle" });
    },

    updateTaskProgress: (ticks) => {
      const { currentTask } = get();
      if (!currentTask) return;

      switch (currentTask.type) {
        case "gathering":
          handleGatheringProgress(ticks);
          break;
        case "crafting":
          handleCraftingProgress(ticks);
          break;
        default:
          console.warn("Unknown task type:", currentTask.type);
      }
    },

    gainSkillXp: (skillId, xp) => {
      set((state) => {
        const skill = state.hunterSkills[skillId];
        if (!skill) return state;

        const newExperience = skill.experience + xp;

        if (newExperience >= skill.experienceToNextLevel) {
          return {
            hunterSkills: {
              ...state.hunterSkills,
              [skillId]: {
                ...skill,
                level: skill.level + 1,
                experience: newExperience - skill.experienceToNextLevel,
                experienceToNextLevel: calculateExperienceRequirement(skillId, skill.level + 1),
              },
            },
          };
        }

        return {
          hunterSkills: {
            ...state.hunterSkills,
            [skillId]: {
              ...skill,
              experience: newExperience,
            },
          },
        };
      });
    },
    loadState: (loadedState) => {
      set({
        hunterSkills: loadedState.hunterSkills || {}, // Load hunter skills
        currentTask: loadedState.currentTask || null, // Load current task
        progress: loadedState.progress || 0, // Reset task progress
      });
    },
    resetHunterState: () => {
      set({
        hunterId: uuidv4(), // Generate a new unique ID for the hunter
        currentTask: null, // Clear the current task
        progress: 0, // Reset task progress to 0
        isWorking: false, // Set working status to false
        hunterSkills: {
          mining: {
            id: "mining",
            name: "Mining",
            level: 1,
            experience: 0,
            experienceToNextLevel: calculateExperienceRequirement("mining", 1),
          },
          smithing: {
            id: "smithing",
            name: "Smithing",
            level: 1,
            experience: 0,
            experienceToNextLevel: calculateExperienceRequirement("smithing", 1),
          },
          lumbering: {
            id: "lumbering",
            name: "Lumbering",
            level: 1,
            experience: 0,
            experienceToNextLevel: calculateExperienceRequirement("lumbering", 1),
          },
        },
      });

      // Emit an event to signal the reset
      gameEvents.emit("hunterStateChanged", { hunterId: get().hunterId, newState: "idle" });
    },
  };
});
