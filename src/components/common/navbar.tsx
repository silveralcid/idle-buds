import { useViewStore } from '../../stores/view.store';
import { budSpecies } from '../../data/buds/budSpecies.data';
import SaveLoadControls from './SaveLoadControls';
import { useGameStore } from '../../stores/game.store';
import { useHunterStore } from '../../stores/hunter.store';
import { useActiveBudStore } from '../../stores/active-bud.store';

const Navbar = () => {
  const setView = useViewStore((state) => state.setView);
  const isPaused = useGameStore((state) => state.isPaused);
  const pauseGame = useGameStore((state) => state.pauseGame);
  const unpauseGame = useGameStore((state) => state.unpauseGame);
  const hunterActivity = useHunterStore((state) => state.currentActivity);
  const stopHunterActivity = useHunterStore((state) => state.stopHunterActivity);
  const budActivities = useActiveBudStore((state) => state.budActivities);

  const addRandomBudToParty = () => {
    const activeBudStore = useActiveBudStore.getState();
    const randomSpecies = budSpecies[Math.floor(Math.random() * budSpecies.length)];
    
    // Create the bud first
    const newBud = activeBudStore.createBud(randomSpecies);
    
    // Check if adding to party was successful
    const success = activeBudStore.addBudToParty(newBud);
    if (!success) {
      console.warn('❌ Failed to add bud to party - party might be full');
    }
  };

  const togglePause = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    
    // Stop all activities when pausing
    if (!isPaused) {
      if (hunterActivity) {
        stopHunterActivity();
      }
      
      // Stop all bud activities
      Object.keys(budActivities).forEach(budId => {
        useActiveBudStore.getState().stopBudActivity(budId);
      });
      
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
              <button onClick={addRandomBudToParty} className="btn btn-primary">
                Add Random Bud to Party
              </button>
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