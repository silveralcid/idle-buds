import { useGameStore } from '../core/game.store';
import { HunterTask } from '../types/hunter-task.types';

export const TaskManager = {
  startTask: (task: HunterTask): boolean => {
    const { currentTask, setCurrentTask } = useGameStore.getState();

    if (currentTask && currentTask !== task) {
      console.warn(`Cannot start ${task} while ${currentTask} is active`);
      return false;
    }

    setCurrentTask(task);
    return true;
  },

  stopTask: (task: HunterTask): void => {
    const { currentTask, clearCurrentTask } = useGameStore.getState();

    if (currentTask === task) {
      clearCurrentTask();
    }
  },

  isTaskActive: (task: HunterTask): boolean => {
    const { currentTask } = useGameStore.getState();
    return currentTask === task;
  }
};