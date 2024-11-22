import { useActiveBudStore } from '../stores/active-bud.store';
import { useBoxBudStore } from '../stores/box-bud.store';

export const moveBudFromPartyToNode = (budId: string, nodeId: string): boolean => {
  const activeBudStore = useActiveBudStore.getState();
  const bud = activeBudStore.getBudFromParty(budId);
  
  if (!bud) {
    console.warn('❌ Bud not found in party:', { budId });
    return false;
  }

  // Check if bud is already assigned to an activity
  const currentActivity = activeBudStore.getBudActivity(budId);
  if (currentActivity) {
    console.warn('❌ Bud is already assigned to an activity:', { budId, activity: currentActivity });
    return false;
  }

  return true;
};

export const moveBudFromNodeToParty = (budId: string, nodeId: string): boolean => {
  const activeBudStore = useActiveBudStore.getState();
  const bud = activeBudStore.getBudFromParty(budId);
  
  if (!bud) {
    console.warn('❌ Bud not found in party:', { budId });
    return false;
  }

  // Check if bud is actually assigned to this node
  const activity = activeBudStore.getBudActivity(budId);
  if (!activity || activity.nodeId !== nodeId) {
    console.warn('❌ Bud is not assigned to this node:', { budId, nodeId });
    return false;
  }

  console.log('✅ Moving bud from node to party:', { budId, nodeId });
  return true;
};

export const moveBudFromBoxToParty = (budId: string): boolean => {
  const boxBudStore = useBoxBudStore.getState();
  const activeBudStore = useActiveBudStore.getState();
  
  const bud = boxBudStore.getBudFromBox(budId);
  if (!bud) {
    console.warn('❌ Bud not found in box:', { budId });
    return false;
  }

  const success = activeBudStore.addBudToParty(bud);
  if (success) {
    boxBudStore.removeBudFromBox(budId);
    console.log('✅ Moved bud from box to party:', { budId });
  }
  
  return success;
};

export const moveBudFromPartyToBox = (budId: string): boolean => {
  const boxBudStore = useBoxBudStore.getState();
  const activeBudStore = useActiveBudStore.getState();
  
  const bud = activeBudStore.getBudFromParty(budId);
  if (!bud) {
    console.warn('❌ Bud not found in party:', { budId });
    return false;
  }

  // Stop any active activities before moving
  const activity = activeBudStore.getBudActivity(budId);
  if (activity) {
    activeBudStore.stopBudActivity(budId);
  }

  boxBudStore.addBudToBox(bud);
  activeBudStore.removeBudFromParty(budId);
  console.log('✅ Moved bud from party to box:', { budId });
  
  return true;
};

export const assignBudToGathering = (budId: string, nodeId: string): boolean => {
  const activeBudStore = useActiveBudStore.getState();
  const bud = activeBudStore.getBudFromParty(budId);
  
  if (!bud) {
    console.warn('❌ Bud not found in party:', { budId });
    return false;
  }

  // Check if bud is already assigned to an activity
  const currentActivity = activeBudStore.getBudActivity(budId);
  if (currentActivity) {
    console.warn('❌ Bud is already assigned to an activity:', { budId, activity: currentActivity });
    return false;
  }
  
  // Start the gathering activity directly - this will handle moving the bud from party to active
  const success = activeBudStore.startBudActivity(budId, 'gathering', nodeId);
  if (success) {
    console.log('✅ Assigned bud to gathering:', { budId, nodeId });
  } else {
    console.warn('❌ Failed to assign bud to gathering:', { budId, nodeId });
  }
  
  return success;
};

export const unassignBudFromGathering = (budId: string, nodeId: string): boolean => {
  const activeBudStore = useActiveBudStore.getState();
  
  // Stop the gathering activity
  activeBudStore.stopBudActivity(budId);
  
  // Move bud back to party
  const success = moveBudFromNodeToParty(budId, nodeId);
  if (success) {
    console.log('✅ Unassigned bud from gathering:', { budId, nodeId });
  } else {
    console.warn('❌ Failed to unassign bud from gathering:', { budId, nodeId });
  }
  
  return success;
};
