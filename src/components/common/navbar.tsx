import { useViewStore } from '../../stores/view.store';
import SaveLoadControls from './SaveLoadControls';
import { useGameStore } from '../../stores/game.store';
import { useHunterStore } from '../../stores/hunter.store';

const Navbar = () => {
  const setView = useViewStore((state) => state.setView);
  const isPaused = useGameStore((state) => state.isPaused);
  const pauseGame = useGameStore((state) => state.pauseGame);
  const unpauseGame = useGameStore((state) => state.unpauseGame);
  const hunterActivity = useHunterStore((state) => state.currentActivity);
  const stopHunterActivity = useHunterStore((state) => state.stopHunterActivity);

  const togglePause = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    
    // Stop all activities when pausing
    if (!isPaused) {
      if (hunterActivity) {
        stopHunterActivity();
      }
      
      pauseGame();
    } else {
      unpauseGame();
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-lg" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Left side */}
      <div className="navbar-start">
        <div className="dropdown">
          <div className="flex flex-row gap-2">
            <button
              className="btn"
              onClick={() => setView('TestingView')}
            >
              Testing
            </button>
            <button
              className="btn"
              onClick={() => setView('LumberingView')}
            >
              Lumbering
            </button>
            <button
              className="btn"
              onClick={() => setView('MiningView')}
            >
              Mining
            </button>
            <button
              className="btn"
              onClick={() => setView('SmithingView')}
            >
              Smithing
            </button>
            <SaveLoadControls />
            {/* Action Buttons */}
            <div className="space-x-2">

              <button onClick={togglePause} className="btn btn-secondary">
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Center */}
      <div className="navbar-center">
        <a className="btn btn-ghost normal-case text-xl">Idle Buds</a>
      </div>
    </div>
  );
};

export default Navbar;