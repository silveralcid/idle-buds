import { useViewStore } from '../../stores/view.store';

const Navbar = () => {
  const setView = useViewStore((state) => state.setView);

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