import { useNodeAssignmentStore } from '../stores/nodeAssignment.store';
import { moveBudToNode, moveBudFromNodeToParty } from '../utils/budManagement.utils';

export const useBudAssignment = (nodeId: string) => {
  const { assignments = {} } = useNodeAssignmentStore() || {};
  const assignedBud = assignments[nodeId] || null;

  const assignBud = (budId: string) => {
    if (budId) {
      moveBudToNode(budId, nodeId);
    }
  };

  const removeBud = () => {
    if (assignedBud) {
      console.log(`Removing Bud from resource: ${assignedBud.id}`);
      moveBudFromNodeToParty(assignedBud.id, nodeId);
    }
  };

  const handleAssignBud = (budId: string) => {
    if (budId) {
      assignBud(budId);
    }
  };

  return { assignedBud, assignBud, removeBud, handleAssignBud };
};