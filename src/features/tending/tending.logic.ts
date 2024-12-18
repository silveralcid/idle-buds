import { TaskManager } from "../../utils/task-manager";
import { useTendingStore } from "./tending.store";
import { useBankStore } from "../bank/bank.store";
import { usePartyStore } from "../party/party.store";
import { eggHatchingData } from "../../data/buds/eggHatching.data";
import { createBudInstance } from "../../factories/budFactory";
import { budSpecies } from "../../data/buds/budSpecies.data";
import { GameConfig } from "../../core/constants/game-config";

export const startHatching = (eggId: string): boolean => {
  const tendingStore = useTendingStore.getState();
  const bankStore = useBankStore.getState();
  const partyStore = usePartyStore.getState();

  // Validate conditions
  if (tendingStore.activeHatching || partyStore.isPartyFull()) {
    return false;
  }

  const eggData = eggHatchingData.find(e => e.id === eggId);
  if (!eggData) return false;

  // Validate requirements
  const hasRequiredItems = eggData.requirements.items?.every(item =>
    (bankStore.items[item.itemId] || 0) >= item.amount
  );
  if (!hasRequiredItems) return false;

  // Consume items
  eggData.requirements.items?.forEach(item => {
    bankStore.removeItem(item.itemId, item.amount);
  });

  const currentTime = Date.now();
  
  // Start hatching process with proper time tracking
  tendingStore.setActiveHatching({
    eggId,
    progress: 0,
    totalTicks: eggData.hatchDuration,
    startTime: currentTime,
    lastProcessedTime: currentTime
  });

  // Start the task in TaskManager
  TaskManager.startTask("tending");

  return true;
};

export const processHatchingTick = (deltaTime: number): void => {
  const tendingStore = useTendingStore.getState();
  const { activeHatching } = tendingStore;

  if (!activeHatching) return;

  const tickProgress = deltaTime * GameConfig.TICK.RATE.DEFAULT;
  const newProgress = activeHatching.progress + tickProgress;

  if (newProgress >= activeHatching.totalTicks) {
    completeHatching(activeHatching.eggId);
  } else {
    tendingStore.updateHatchingProgress(newProgress);
  }
};

export const completeHatching = (eggId: string): void => {
  const tendingStore = useTendingStore.getState();
  const partyStore = usePartyStore.getState();
  const eggData = eggHatchingData.find(e => e.id === eggId);

  if (!eggData) {
    tendingStore.cancelHatching();
    return;
  }

  // Find species data
  const species = budSpecies.find(s => s.speciesId === eggData.speciesId);
  if (!species) {
    tendingStore.cancelHatching();
    return;
  }

  // Create and add new bud
  const newBud = createBudInstance(species);
  const success = partyStore.addBud(newBud);

  if (success) {
    // Award XP
    const newXp = tendingStore.xp + eggData.experienceReward;
    tendingStore.setXp(newXp);
  }

  tendingStore.cancelHatching();
};

export const calculateHatchingProgress = (
  currentProgress: number,
  totalTicks: number,
  timeElapsed: number
): { progress: number; isComplete: boolean } => {
  const tickProgress = timeElapsed * GameConfig.TICK.RATE.DEFAULT;
  const newProgress = currentProgress + tickProgress;
  
  return {
    progress: Math.min(newProgress, totalTicks),
    isComplete: newProgress >= totalTicks
  };
};
