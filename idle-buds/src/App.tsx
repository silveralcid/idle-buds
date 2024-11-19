import Navbar from './components/common/navbar';
import GameContainer from './views/GameContainer';
import LumberingView from './views/gathering/LumberingView';

function App() {
  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />
      <GameContainer>
        <LumberingView />
      </GameContainer>
    </div>
  );
}

export default App;