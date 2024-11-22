import { useAssignmentStore } from '../stores/assignment.store';
import { AssignmentType } from '../types/assignment.types';
import { useHunterStore } from '../stores/hunter.store';
import { useCallback } from 'react';

export const useBudAssignment = (nodeId: string, type: AssignmentType) => {
  const { assignBud, unassignBud, getNodeAssignment } = useAssignmentStore();
  const party = useHunterStore(state => state.party);

  const assignment = getNodeAssignment(nodeId);
  const assignedBud = assignment ? party.find(b => b.id === assignment.budId) : null;

  const assign = useCallback((budId: string, activityId?: string) => {
    if (!budId) return false;
    return assignBud(budId, type, nodeId, activityId);
  }, [nodeId, type, assignBud]);

  const unassign = useCallback(() => {
    if (assignment) {
      unassignBud(assignment.budId);
    }
  }, [assignment, unassignBud]);

  return {
    assignedBud,
    assignment,
    assign,
    unassign,
    isAssigned: !!assignment
  };
};