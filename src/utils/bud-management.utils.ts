import { useActivityStore } from '../stores/active-bud.store';
import { useBudStore } from '../stores/box-bud.store';
import { useHunterStore } from '../stores/hunter.store';
import { useAssignmentStore } from '../stores/assignment.store';

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
  const assignmentStore = useAssignmentStore.getState();
  const activityStore = useActivityStore.getState();
  
  // Check if bud exists and is available
  const currentAssignment = assignmentStore.getBudAssignment(budId);
  if (currentAssignment) {
    console.warn('❌ Bud is already assigned:', currentAssignment);
    return false;
  }

  // Assign bud to node
  assignmentStore.assignBud(budId, 'gathering', nodeId);
  
  // Start activity
  activityStore.startActivity('bud', {
    type: 'gathering',
    nodeId,
    budId
  });

  console.log('✅ Moved bud to node:', { budId, nodeId });
  return true;
};

export const moveBudFromNodeToParty = (budId: string, nodeId: string): boolean => {
  const assignmentStore = useAssignmentStore.getState();
  const activityStore = useActivityStore.getState();
  
  // Stop activity first
  activityStore.stopActivity('bud', budId);
  
  // Remove assignment
  assignmentStore.unassignBud(budId);
  
  console.log('✅ Moved bud from node to party:', { budId, nodeId });
  return true;
};

export const gainBudExperience = (budId: string, amount: number): void => {
  const budStore = useBudStore.getState();
  budStore.gainExperience(budId, amount);
};