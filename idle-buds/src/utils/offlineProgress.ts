import { useGameStore } from '../stores/useStore';

const LAST_ACTIVE_KEY = 'idle_buds_last_active';

export const updateLastActiveTime = () => {
  localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
};

interface WoodcuttingProgress {
  experience: number;
  resources: {
    wood: number;
  };
}

interface OfflineProgress {
  woodcutting: WoodcuttingProgress;
  // Add other activities here
}

interface GameState {
  woodcutting: {
    baseXpRate: number;
    baseResourceRate: number;
    level: number;
  };
  // Add other state properties
}

export const calculateOfflineProgress = () => {
  const lastActiveStr = localStorage.getItem(LAST_ACTIVE_KEY);
  if (!lastActiveStr) return;

  const lastActive = parseInt(lastActiveStr);
  const currentTime = Date.now();
  const timeDiff = currentTime - lastActive;

  if (timeDiff < 1000) return;

  const gameState = useGameStore.getState() as GameState;
  const offlineMinutes = Math.floor(timeDiff / (1000 * 60));

  // Calculate offline progress for each activity
  const offlineProgress = {
    woodcutting: {
      experience: calculateWoodcuttingExp(gameState, offlineMinutes),
      resources: calculateWoodcuttingResources(gameState, offlineMinutes)
    },
    // Add other activities here
  };

  return {
    offlineTime: timeDiff,
    progress: offlineProgress
  };
};

function calculateWoodcuttingExp(gameState: GameState, minutes: number): number {
  const baseXpRate = gameState.woodcutting.baseXpRate || 1;
  const level = gameState.woodcutting.level || 1;
  const multiplier = 1 + (level * 0.1); // 10% boost per level
  
  return Math.floor(baseXpRate * minutes * multiplier);
}

function calculateWoodcuttingResources(gameState: GameState, minutes: number) {
  const baseRate = gameState.woodcutting.baseResourceRate || 1;
  const level = gameState.woodcutting.level || 1;
  const multiplier = 1 + (level * 0.05); // 5% boost per level

  return {
    wood: Math.floor(baseRate * minutes * multiplier)
  };
}

export const applyOfflineProgress = (progress: { progress: OfflineProgress }) => {
  const store = useGameStore.getState();
  
  // Update woodcutting
  if (progress.progress.woodcutting) {
    store.addWoodcuttingExperience(progress.progress.woodcutting.experience);
    store.addResource('wood', progress.progress.woodcutting.resources.wood);
  }
  
  // Add other activity updates here
};

// Usage example:
export const handleOfflineProgress = () => {
  const progress = calculateOfflineProgress();
  if (progress) {
    applyOfflineProgress(progress);
    // Optionally show a modal with the progress
    return progress; // Return progress for UI display
  }
};