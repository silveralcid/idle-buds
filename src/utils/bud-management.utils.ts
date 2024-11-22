import { useActivityStore } from '../stores/activity.store';
import { useBudStore } from '../stores/bud.store';

export const moveBudToParty = (budId: string): boolean => {
  const budStore = useBudStore.getState();
  const activityStore = useActivityStore.getState();
  const bud = budStore.getBud(budId);
  
  if (!bud) return false;
  
  const success = budStore.addBudToParty(budId);
  if (success) {
    activityStore.stopActivity('bud', budId);
  }
  
  return success;
};

export const moveBudToBox = (budId: string): boolean => {
  const budStore = useBudStore.getState();
  const activityStore = useActivityStore.getState();
  const bud = budStore.getBud(budId);
  
  if (!bud) return false;
  
  activityStore.stopActivity('bud', budId);
  budStore.moveBudToBox(budId);
  return true;
};

export const moveBudToNode = (budId: string, nodeId: string): boolean => {
  const budStore = useBudStore.getState();
  const activityStore = useActivityStore.getState();
  
  const bud = budStore.getBud(budId);
  if (!bud) return false;

  // Ensure bud is in party first
  if (!budStore.buds.party.some(b => b.id === budId)) {
    const success = budStore.addBudToParty(budId);
    if (!success) return false;
  }

  // Start the gathering activity for this bud
  activityStore.startActivity('bud', {
    type: 'gathering',
    nodeId,
    budId
  });
  
  return true;
};

export const moveBudFromNodeToParty = (budId: string, nodeId: string): boolean => {
  const activityStore = useActivityStore.getState();
  const activity = activityStore.budActivities[budId];
  
  if (!activity || activity.nodeId !== nodeId) {
    console.warn(`No matching activity found for bud ${budId} at node ${nodeId}`);
    return false;
  }
  
  activityStore.stopActivity('bud', budId);
  return true;
};

export const gainBudExperience = (budId: string, amount: number): void => {
  const budStore = useBudStore.getState();
  budStore.gainExperience(budId, amount);
};