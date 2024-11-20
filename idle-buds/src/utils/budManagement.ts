import { useBudBoxStore } from '../stores/budBox.store';
import { useHunterStore } from '../stores/hunter.store';

export const moveBudToParty = (budId: string) => {
  const { buds, removeBud } = useBudBoxStore.getState();
  const { addBudToParty } = useHunterStore.getState();

  const bud = buds.find((b) => b.id === budId);
  if (bud) {
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