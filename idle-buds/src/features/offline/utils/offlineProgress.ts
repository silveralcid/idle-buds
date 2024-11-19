import { useGameStore } from '../../../stores/useStore';
import type { Activity } from '../../../features/common/activity.types';

const LAST_ACTIVE_KEY = 'idle_buds_last_active';
const LAST_ACTIVITY_KEY = 'idle_buds_last_activity';

export const updateLastActiveTime = () => {
  localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
  // Save current activity
  const currentActivity = useGameStore.getState().currentActivity;
  localStorage.setItem(LAST_ACTIVITY_KEY, currentActivity);
};

interface ResourceProgress {
  [resourceName: string]: number;
}

interface ActivityProgress {
  experience: number;
  resources: ResourceProgress;
}

interface OfflineProgress {
  [key: string]: ActivityProgress;
}

interface GameState {
  currentActivity: Activity;
  woodcutting: {
    baseXpRate: number;
    baseResourceRate: number;
    level: number;
    resourceName: string;
  };
  // Add other activities here as needed
}

export const calculateOfflineProgress = () => {
  const lastActiveStr = localStorage.getItem(LAST_ACTIVE_KEY);
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY) as Activity;
  
  if (!lastActiveStr || !lastActivity) return;

  const lastActive = parseInt(lastActiveStr);
  const currentTime = Date.now();
  const timeDiff = currentTime - lastActive;

  if (timeDiff < 1000) return;

  const gameState = useGameStore.getState() as GameState;
  const offlineMinutes = Math.floor(timeDiff / (1000 * 60));

  // Initialize empty progress object
  const progress: OfflineProgress = {};

  // Calculate progress based on last active activity
  switch (lastActivity) {
    case 'woodcutting':
      progress.woodcutting = {
        experience: calculateWoodcuttingExp(gameState, offlineMinutes),
        resources: calculateWoodcuttingResources(gameState, offlineMinutes)
      };
      break;
    // Add other activities here
    default:
      console.log('Unknown activity:', lastActivity);
      return;
  }

  return {
    offlineTime: timeDiff,
    progress,
    lastActivity
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
  const resourceName = gameState.woodcutting.resourceName || 'logs';

  return {
    [resourceName]: Math.floor(baseRate * minutes * multiplier)
  };
}

export const applyOfflineProgress = (progress: { 
  progress: OfflineProgress,
  lastActivity: Activity 
}) => {
  const store = useGameStore.getState();
  
  switch (progress.lastActivity) {
    case 'woodcutting':
      if (progress.progress.woodcutting) {
        store.addWoodcuttingExperience(progress.progress.woodcutting.experience);
        
        Object.entries(progress.progress.woodcutting.resources).forEach(([resourceName, amount]) => {
          store.addResource(resourceName, amount);
        });
      }
      break;
    // Add other activities here
  }
};

export const handleOfflineProgress = () => {
  const progress = calculateOfflineProgress();
  if (progress) {
    applyOfflineProgress({
      progress: progress.progress,
      lastActivity: progress.lastActivity
    });
    return progress;
  }
};
