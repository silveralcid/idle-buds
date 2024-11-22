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
  
  // First try to assign the bud
  const success = budStore.assignBudToNode(budId, nodeId);
  if (!success) return false;

  // Then start the activity
  activityStore.startActivity('bud', {
    type: 'gathering',
    nodeId,
    budId
  });
  
  console.log('✅ Bud moved to node successfully');
  return true;
};

export const moveBudFromNodeToParty = (budId: string, nodeId: string): boolean => {
  const budStore = useBudStore.getState();
  const activityStore = useActivityStore.getState();
  
  // Stop the activity first
  activityStore.stopActivity('bud', budId);
  
  // Then update bud store
  return budStore.unassignBud(budId);
};

export const gainBudExperience = (budId: string, amount: number): void => {
  const budStore = useBudStore.getState();
  budStore.gainExperience(budId, amount);
};