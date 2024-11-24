import { GameConfig } from "../constants/game-config";
import { GameEvents } from "../game-events/game-events";

export class GameLoop {
  private static instance: GameLoop;
  private intervalId: NodeJS.Timeout | null = null;

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
      gameEvents.emit("gameTick");
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

  /** Restarts the game loop */
  restart(): void {
    this.stop();
    this.start();
  }
}
