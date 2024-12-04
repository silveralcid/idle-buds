export interface BaseTask {
    type: "gathering" | "crafting"; // Task type
    taskId: string; // Unique identifier for the task (e.g., resource node or workbench)
    skillId: string; // The skill associated with the task
    ownerType: "hunter" | "bud"; // Differentiates between Hunters and Buds
    ownerId: string; // The specific Hunter or Bud performing the task
  }
  