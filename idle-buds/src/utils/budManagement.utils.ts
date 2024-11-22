import { useBudBoxStore } from '../stores/budBox.store';
import { useHunterStore } from '../stores/hunter.store';
import { useNodeAssignmentStore } from '../stores/nodeAssignment.store';

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

export const moveBudToNode = (budId: string, nodeId: string) => {
  const { party, removeBudFromParty } = useHunterStore.getState();
  const { assignBudToNode } = useNodeAssignmentStore.getState();

  const bud = party.find((b: any) => b.id === budId);
  if (bud) {
    removeBudFromParty(budId);
    assignBudToNode(nodeId, bud);
  }
};

export const moveBudFromNodeToParty = (budId: string, nodeId: string) => {
  const { assignments, removeBudFromNode } = useNodeAssignmentStore.getState();
  const { addBudToParty } = useHunterStore.getState();

  const bud = assignments[nodeId];
  if (bud && bud.id === budId) {
    console.log(`Moving Bud from node to party: ${bud.id}`);
    removeBudFromNode(nodeId);
    addBudToParty(bud);
  } else {
    console.warn(`Bud not found in resource: ${budId}`);
  }
};

export const increaseBudExperience = (budId: string, amount: number) => {
  const { assignments } = useNodeAssignmentStore.getState();
  const bud = assignments[Object.keys(assignments).find(key => assignments[key]?.id === budId) as string];
  if (!bud) return;

  const newExperience = bud.experience + amount;
  if (newExperience >= bud.experienceToNextLevel) {
    useNodeAssignmentStore.setState((state) => ({
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
    useNodeAssignmentStore.setState((state) => ({
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