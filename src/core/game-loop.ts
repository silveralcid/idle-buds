import { GameConfig } from "./constants/game-config";
import { GameEvents } from "./game-events";

export class GameLoop {
  private static instance: GameLoop;
  private intervalId: NodeJS.Timeout | null = null;
  private isPaused: boolean = false;

  private constructor() {}

  static getInstance(): GameLoop {
    if (!GameLoop.instance) {
      GameLoop.instance = new GameLoop();
    }
    return GameLoop.instance;
  }

  /** Starts the game loop */
  start(): void {
    const gameEvents = GameEvents.getInstance();

    if (this.intervalId) {
      console.warn("Game loop already running.");
      return;
    }

    this.intervalId = setInterval(() => {
      if (!this.isPaused) {
        gameEvents.emit("gameTick");
      }
    }, GameConfig.TICK.DURATION);

    console.log("Game loop started.");
  }

  /** Stops the game loop */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Game loop stopped.");
    }
  }

  /** Pauses the game loop */
  pause(): void {
    if (!this.isPaused) {
      this.isPaused = true;
      console.log("Game loop paused.");
      GameEvents.getInstance().emit("gamePaused"); // Emit a global pause event
    }
  }

  /** Resumes the game loop */
  resume(): void {
    if (this.isPaused) {
      this.isPaused = false;
      console.log("Game loop resumed.");
      GameEvents.getInstance().emit("gameResumed"); // Emit a global unpause event
    }
  }

  /** Restarts the game loop */
  restart(): void {
    this.stop();
    this.start();
  }

  /** Toggles between pause and resume */
  togglePause(): void {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }
}