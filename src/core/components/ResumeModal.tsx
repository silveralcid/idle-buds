import { useGameStore } from "../game.store";
import { calculateTimeAway } from "../../utils/offline-progression";

export function ResumeModal() {
  const isPaused = useGameStore((state) => state.isPaused);
  const isVisible = useGameStore((state) => state.isVisible);
  const startGame = useGameStore((state) => state.startGame);

  if (!isPaused || !isVisible) return null;

  const currentTime = Date.now();
  const lastSaveTime = useGameStore.getState().lastSaveTime || currentTime;

  // Use the utility function
  const { timeAwayMilliseconds, timeAwayMessage } = calculateTimeAway(lastSaveTime, currentTime);

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Welcome Back!</h3>
        <p className="py-4">Your game is paused. Ready to continue your adventure?</p>
        <p>Current time: {new Date(currentTime).toLocaleString()}</p>
        <p>Last saved: {new Date(lastSaveTime).toLocaleString()}</p>
        <p>Time away: {timeAwayMessage}</p>
        <div className="modal-action">
          <button className="btn btn-primary" onClick={() => startGame()}>
            Resume Game
          </button>
        </div>
      </div>
    </div>
  );
}
