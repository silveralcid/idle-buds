import mitt, { Emitter } from "mitt";
import { BaseTask } from "../../types/task.types";

export type GameEventPayloads = {
  // Global Events
  gameInitialized: void;
  gameTick: void;
  resourceGathered: { name: string; quantity: number };
  gamePaused: void;
  gameResumed: void;

  // Offline Events
  offlineProgressCalculated: { xpGained: number; itemsGained: Record<string, number>; itemsLost: Record<string, number> };
  gatheringOfflineTick: { task: BaseTask };
  craftingOfflineTick: { task: BaseTask };
  offlineTick: { task: BaseTask };

  // Hunter Events
  hunterStateChanged: { hunterId: string; newState: "idle" | "active" | "combat" };
  hunterSkillXpGained: { hunterId: string; skillName: string; xpGained: number };
  hunterTaskAssigned: { hunterId: string; task: string };
  hunterTaskCompleted: { hunterId: string; task: string; results: any };
};

export class GameEvents {
  private static instance: GameEvents;
  private emitter: Emitter<GameEventPayloads>;

  private constructor() {
    this.emitter = mitt<GameEventPayloads>();

    // Register offlineTick handler
    this.emitter.on("offlineTick", (event) => {
      const { task } = event;
      switch (task.type) {
        case "gathering":
          this.emitter.emit("gatheringOfflineTick", { task });
          break;
        case "crafting":
          this.emitter.emit("craftingOfflineTick", { task });
          break;
        default:
          console.warn("Unhandled task type in offline progress:", task.type);
      }
    });
  }

  static getInstance(): GameEvents {
    if (!GameEvents.instance) {
      GameEvents.instance = new GameEvents();
    }
    return GameEvents.instance;
  }

  emit<K extends keyof GameEventPayloads>(type: K, payload?: GameEventPayloads[K]): void {
    this.emitter.emit(type, payload!);
  }

  on<K extends keyof GameEventPayloads>(type: K, handler: (event: GameEventPayloads[K]) => void): void {
    this.emitter.on(type, handler);
  }

  off<K extends keyof GameEventPayloads>(type: K, handler: (event: GameEventPayloads[K]) => void): void {
    this.emitter.off(type, handler);
  }
}
