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

  const bud = party.find((b: any) => b.id === budId);
  if (bud) {
    removeBudFromParty(budId);
    addBud(bud);
  }
};

export const moveBudToResource = (budId: string, resourceId: string) => {
  const { party, removeBudFromParty } = useHunterStore.getState();
  const { assignBudToResource } = useResourceAssignmentStore.getState();

  const bud = party.find((b: any) => b.id === budId);
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

export const increaseBudExperience = (budId: string, amount: number) => {
  const { assignments } = useResourceAssignmentStore.getState();
  const bud = assignments[Object.keys(assignments).find(key => assignments[key]?.id === budId) as string];
  if (!bud) return;

  const newExperience = bud.experience + amount;
  if (newExperience >= bud.experienceToNextLevel) {
    useResourceAssignmentStore.setState((state) => ({
      assignments: {
        ...state.assignments,
        [Object.keys(assignments).find(key => assignments[key]?.id === budId) as string]: {
          ...bud,
          experience: newExperience - bud.experienceToNextLevel,
          level: bud.level + 1,
          experienceToNextLevel: bud.experienceToNextLevel * 1.1, // Example scaling
        },
      },
    }));
  } else {
    useResourceAssignmentStore.setState((state) => ({
      assignments: {
        ...state.assignments,
        [Object.keys(assignments).find(key => assignments[key]?.id === budId) as string]: {
          ...bud,
          experience: newExperience,
        },
      },
    }));
  }
};