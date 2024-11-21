export const saveGameState = (state: any) => {
    localStorage.setItem('gameState', JSON.stringify(state));
  };
  
  export const loadGameState = (): any => {
    const savedState = localStorage.getItem('gameState');
    return savedState ? JSON.parse(savedState) : null;
  };
  
  export const resetGameState = () => {
    localStorage.removeItem('gameState');
  };