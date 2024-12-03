import { GameConfig } from "./constants/game-config";
import { GameEvents } from "./game-events";
import { processMiningTick } from "../features/mining/mining.logic";

export class GameLoop {
  private static instance: GameLoop;
  private lastTimestamp: number = 0;
  public isPaused: boolean = false;
  private running: boolean = false;
  private lastStopTimestamp: number | null = null;

  private constructor() {}

  static getInstance(): GameLoop {
    if (!GameLoop.instance) {
      GameLoop.instance = new GameLoop();
    }
    return GameLoop.instance;
  }

  /** Starts the game loop */
  start(): void {
    if (this.running) {
      console.warn("Game loop already running.");
      return;
    }

    this.running = true;
    this.isPaused = false;
    this.lastTimestamp = performance.now();

    const gameEvents = GameEvents.getInstance();

    const tick = (currentTimestamp: number) => {
      if (!this.running || this.isPaused) {
        return;
      }

      const elapsed = currentTimestamp - this.lastTimestamp;
      if (elapsed >= GameConfig.TICK.DURATION) {
        const deltaTime = elapsed / 1000; // Convert elapsed time to seconds
        gameEvents.emit("gameTick", deltaTime); // Pass deltaTime to gameTick event
        
        processMiningTick(deltaTime);

        this.lastTimestamp = currentTimestamp; // Adjust to the current time
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);

    console.log("Game loop started.");
  }

  /** Stops the game loop */
  stop(): void {
    this.running = false;
    this.isPaused = true;
    this.lastStopTimestamp = performance.now();
    console.log("Game loop stopped.");
  }

  /** Pauses the game loop */
  // Not sure if we actually need pause/resume since start/stop does this already...
  pause(): void {
    if (!this.isPaused) {
      this.isPaused = true;
      this.lastStopTimestamp = performance.now(); // Record the time of pause
      console.log("Game loop paused.");
      GameEvents.getInstance().emit("gamePaused");
    }
  }

  /** Resumes the game loop */
  resume(): void {
    if (this.isPaused) {
      const currentTimestamp = performance.now();
      if (this.lastStopTimestamp) {
        const offlineTime = (currentTimestamp - this.lastStopTimestamp) / 1000; // Time in seconds
        GameEvents.getInstance().emit("offlineProgress", offlineTime);
      }

      this.isPaused = false;
      this.lastStopTimestamp = null; // Clear the timestamp
      console.log("Game loop resumed.");
      GameEvents.getInstance().emit("gameResumed");
    }
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

