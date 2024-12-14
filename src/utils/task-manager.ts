import { useGameStore } from '../core/game.store';
import { HunterTask } from '../types/hunter-task.types';
import { useMiningStore } from '../features/mining/mining.store';
import { useLumberingStore } from '../features/lumbering/lumbering.store';
import { useSmithingStore } from '../features/smithing/smithing.store';

export const TaskManager = {
  startTask: function(task: HunterTask): void {
    const { currentTask, setCurrentTask } = useGameStore.getState();

    // If there's a different activity running, stop it first
    if (currentTask && currentTask !== task) {
      this.stopCurrentTask();
    }

    // Ensure game is running when starting a task
    useGameStore.getState().startGame();
    setCurrentTask(task);
  },

  stopCurrentTask: function(): void {
    const { currentTask } = useGameStore.getState();
    
    if (!currentTask) return;

    // Stop the specific activity based on type
    switch (currentTask) {
      case "mining":
        useMiningStore.setState({ activeNode: null });
        break;
      case "lumbering":
        useLumberingStore.setState({ activeNode: null });
        break;
      case "smithing":
      case "smelting":
        const smithingStore = useSmithingStore.getState();
        // Deactivate all workbenches
        Object.keys(smithingStore.workbenches).forEach(workbenchId => {
          smithingStore.activateWorkbench(workbenchId, ''); // Pass empty string to deactivate
        });
        break;
    }

    // Ensure game is paused when stopping a task
    useGameStore.getState().pauseGame();
    useGameStore.getState().clearCurrentTask();
  },

  isTaskActive: function(task: HunterTask): boolean {
    const { currentTask } = useGameStore.getState();
    return currentTask === task;
  }
};
