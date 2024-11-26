import mitt, { Emitter } from "mitt";

export type GameEventPayloads = {
  // Global Events
  gameInitialized: void;
  gameTick: number;
  gamePaused: void;
  gameResumed: void;
  offlineProgress: number;
};

export class GameEvents {
  private static instance: GameEvents;
  private emitter: Emitter<GameEventPayloads>;

  private constructor() {
    this.emitter = mitt<GameEventPayloads>();
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