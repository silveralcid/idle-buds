import { useResourceAssignmentStore } from '../stores/resourceAssignment.store';
import { moveBudToResource, moveBudFromResourceToParty } from '../utils/budManagement.utils';

export const useBudAssignment = (resourceId: string) => {
  const { assignments } = useResourceAssignmentStore();
  const assignedBud = assignments[resourceId] || null;

  const assignBud = (budId: string) => {
    if (budId) {
      moveBudToResource(budId, resourceId);
    }
  };

  const removeBud = () => {
    if (assignedBud) {
      console.log(`Removing Bud from resource: ${assignedBud.id}`);
      moveBudFromResourceToParty(assignedBud.id, resourceId);
    }
  };

  const handleAssignBud = (budId: string) => {
    if (budId) {
      assignBud(budId);
    }
  };

  return { assignedBud, assignBud, removeBud, handleAssignBud };
};