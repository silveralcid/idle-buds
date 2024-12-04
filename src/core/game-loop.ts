import { GameConfig } from "./constants/game-config";
import { GameEvents } from "./game-events";
import { processMiningTick } from "../features/mining/mining.logic";

export class GameLoop {
  private static instance: GameLoop;
  private lastTimestamp: number = 0;
  public isPaused: boolean = false;
  private running: boolean = false;
  public lastStopTimestamp: number | null = null;

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
  pause(): void {
    this.running = false;
    this.isPaused = true;
    this.lastStopTimestamp = performance.now();
    console.log("Game loop paused.");
  }
}

