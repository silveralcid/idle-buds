import { useGameStore } from "../core/game.store";
import { GameLoop } from "../core/game-loop";
import { GameEvents } from "../core/game-events";
import { processMiningTick } from "../features/mining/mining.logic";
import { processOfflineProgress } from "../core/offline-loop";

export function initializeGame() {
  const { loadGame, startGame, lastSaveTime, handleVisibilityChange } = useGameStore.getState();
  
  const currentTime = Date.now();
  const canLoadGame = lastSaveTime !== undefined;

  if (canLoadGame) {
    console.log("Loading saved game...");
    loadGame();
    handleVisibilityChange();
  } else {
    console.log("No saved game found, initializing game...");
    startGame();
    useGameStore.setState({
        isPaused: true, // Set game to paused by default
        isVisible: true,
        lastSaveTime: currentTime,
      });
  }

  // Initialize Game Loop and Events
  const gameLoop = GameLoop.getInstance();
  const gameEvents = GameEvents.getInstance();

  const handleGameTick = (deltaTime: number) => {
        processMiningTick(deltaTime); 
  };

  gameEvents.on("gameTick", handleGameTick);

  // Cleanup function for the caller to use
  return () => {
    gameLoop.pause();
    gameEvents.off("gameTick", handleGameTick);
  };
}
