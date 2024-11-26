import { GameConfig } from "./constants/game-config";
import { GameEvents } from "./game-events";

export class GameLoop {
    private static instance: GameLoop;
    private lastTimestamp: number = 0;
    private isPaused: boolean = false;
    private running: boolean = false;
  
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
      this.lastTimestamp = performance.now();
  
      const gameEvents = GameEvents.getInstance();
  
      const tick = (currentTimestamp: number) => {
        if (!this.running || this.isPaused) {
          return;
        }
  
        const elapsed = currentTimestamp - this.lastTimestamp;
        if (elapsed >= GameConfig.TICK.DURATION) {
          gameEvents.emit("gameTick");
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
      console.log("Game loop stopped.");
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
  }
  