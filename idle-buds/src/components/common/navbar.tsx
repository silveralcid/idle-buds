import { useViewStore } from '../../stores/view.store';
import { createBudInstance } from '../../factories/budFactory';
import { budSpecies } from '../../data/buds/budSpecies.data';
import { useHunterStore } from '../../stores/hunter.store'; // Import the hunter store
import SaveLoadControls from './SaveLoadControls';

const Navbar = () => {
  const setView = useViewStore((state) => state.setView);
  const addBudToParty = useHunterStore((state) => state.addBudToParty); // Access addBudToParty

  const addRandomBudToParty = () => {
    const randomSpecies = budSpecies[Math.floor(Math.random() * budSpecies.length)];
    const newBud = createBudInstance(randomSpecies);
    addBudToParty(newBud);
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
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
            {/* Action Buttons */}
            <div className="space-x-2">
              <button onClick={addRandomBudToParty} className="p-2 bg-green-500 text-white rounded">
                Add Random Bud to Party
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Center */}
      <div className="navbar-center">
        <a className="btn btn-ghost normal-case text-xl">Idle Buds</a>
        <SaveLoadControls />
      </div>
    </div>
  );
};

export default Navbar;