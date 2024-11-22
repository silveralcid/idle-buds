import { useCallback } from 'react';
import { useActivityStore } from '../stores/active-bud.store';
import { useBudStore } from '../stores/box-bud.store';
import { moveBudToNode, moveBudFromNodeToParty } from '../utils/bud-management.utils';

export const useBudAssignment = (nodeId: string, type: 'gathering' | 'crafting') => {
  const getBudActivity = useActivityStore(state => state.getBudActivity);
  const budsInParty = useBudStore(state => state.buds.party);

  // Find assignment by checking activity store
  const findAssignedBud = () => {
    for (const bud of budsInParty) {
      const activity = getBudActivity(bud.id);
      if (activity?.nodeId === nodeId) {
        return { budId: bud.id, bud };
      }
    }
    return null;
  };

  const assignment = findAssignedBud();
  const assignedBud = assignment?.bud ?? null;

  const assign = useCallback((budId: string, activityId?: string) => {
    if (!budId) return false;
    return moveBudToNode(budId, nodeId);
  }, [nodeId]);

  const unassign = useCallback(() => {
    if (assignment) {
      return moveBudFromNodeToParty(assignment.budId, nodeId);
    }
    return false;
  }, [assignment, nodeId]);

  return {
    assignedBud,
    assignment,
    assign,
    unassign,
    isAssigned: !!assignment
  };
};