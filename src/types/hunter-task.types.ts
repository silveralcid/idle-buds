export type HunterTask = "mining" | "lumbering" | "smithing" | "smelting" | null;

export interface HunterTaskState {
  currentTask: HunterTask;
  setCurrentTask: (task: HunterTask) => void;
  clearCurrentTask: () => void;
}
