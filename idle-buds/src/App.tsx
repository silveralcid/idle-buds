import Navbar from './components/common/navbar';
import GameContainer from './views/GameContainer';
import LumberingView from './views/gathering/LumberingView';
import TestingView from './views/TestingView';
import { useViewStore } from './stores/view.store';
import MiningView from './views/gathering/MiningView';

function App() {
  const currentView = useViewStore((state) => state.currentView);

  const renderView = () => {
    switch (currentView) {
      case 'TestingView':
        return <TestingView />;
      case 'MiningView':
        return <MiningView />;
      case 'LumberingView':
      default:
        return <LumberingView />;
    }
  };

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />
      <GameContainer>
        {renderView()}
      </GameContainer>
    </div>
  );
}

export default App;

