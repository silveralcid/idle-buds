import { useActivityStore } from '../stores/activity.store';
import { useBudStore } from '../stores/bud.store';
import { useHunterStore } from '../stores/hunter.store';

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
  
  // Check if bud exists
  const bud = budStore.getBud(budId);
  if (!bud) {
    console.warn('❌ Bud not found:', { budId });
    return false;
  }

  // Check for existing activity
  const currentActivity = activityStore.getBudActivity(budId);
  if (currentActivity) {
    console.warn('❌ Bud is already in an activity:', { budId, activity: currentActivity });
    return false;
  }

  // Assign bud to node and start activity in one transaction
  const success = budStore.assignBudToNode(budId, nodeId);
  if (success) {
    activityStore.startActivity('bud', {
      type: 'gathering',
      nodeId,
      budId
    });
  }
  
  return success;
};

export const moveBudFromNodeToParty = (budId: string, nodeId: string): boolean => {
  const budStore = useBudStore.getState();
  const activityStore = useActivityStore.getState();
  
  // Stop the activity first
  activityStore.stopActivity('bud', budId);
  
  // Move directly to party using the store action
  budStore.addToParty(budId);
  budStore.unassignBud(budId);
  
  return true;
};

export const gainBudExperience = (budId: string, amount: number): void => {
  const budStore = useBudStore.getState();
  budStore.gainExperience(budId, amount);
};