import { useViewStore } from "./core/view.state";


function App() {
  const currentView = useViewStore((state) => state.currentView);

  const renderView = () => {
    switch (currentView) {
    }
  };

  return (
    <div className="min-h-screen bg-base-300">
      <GameContainer>
        {renderView()}
      </GameContainer>
    </div>
  );
}

export default App;

