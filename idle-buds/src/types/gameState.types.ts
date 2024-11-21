export interface GameState {
    resources: Record<string, number>;
    fractionalResources: Record<string, number>;
    fractionalXP: Record<string, number>;
    isGathering: boolean;
    currentActivity: string | null; // Hunter's current activity
    budActivity: string | null; // Bud's current activity
    startGathering: (activityId: string, isBud: boolean) => void;
    stopHunterGathering: () => void;
    stopBudGathering: () => void;
    updateResources: (deltaTime: number) => void;
  }