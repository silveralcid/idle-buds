import { useBudBoxStore } from '../stores/budBox.store';
import { useHunterStore } from '../stores/hunter.store';
import { useResourceAssignmentStore } from '../stores/resourceAssignment.store';

export const moveBudToParty = (budId: string) => {
  const { buds, removeBud } = useBudBoxStore.getState();
  const { addBudToParty } = useHunterStore.getState();
  const bud = buds.find((b) => b.id === budId);
  if (bud) {
    console.log(`Moving Bud to party: ${bud.id}`);
    removeBud(budId);
    addBudToParty(bud);
  }
};

export const moveBudToBudBox = (budId: string) => {
  const { party, removeBudFromParty } = useHunterStore.getState();
  const { addBud } = useBudBoxStore.getState();

  const bud = party.find((b) => b.id === budId);
  if (bud) {
    removeBudFromParty(budId);
    addBud(bud);
  }
};

export const moveBudToResource = (budId: string, resourceId: string) => {
  const { party, removeBudFromParty } = useHunterStore.getState();
  const { assignBudToResource } = useResourceAssignmentStore.getState();

  const bud = party.find((b) => b.id === budId);
  if (bud) {
    removeBudFromParty(budId);
    assignBudToResource(resourceId, bud);
  }
};

export const moveBudFromResourceToParty = (budId: string, resourceId: string) => {
  const { assignments, removeBudFromResource } = useResourceAssignmentStore.getState();
  const { addBudToParty } = useHunterStore.getState();

  const bud = assignments[resourceId];
  if (bud && bud.id === budId) {
    console.log(`Moving Bud from resource to party: ${bud.id}`);
    removeBudFromResource(resourceId);
    addBudToParty(bud);
  } else {
    console.warn(`Bud not found in resource: ${budId}`);
  }
};