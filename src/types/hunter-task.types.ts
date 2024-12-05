export type HunterTask = "mining" | "lumbering" | null;

export interface HunterTaskState {
  currentTask: HunterTask;
  setCurrentTask: (task: HunterTask) => void;
  clearCurrentTask: () => void;
}
