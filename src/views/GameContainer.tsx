import React from 'react';

interface GameContainerProps {
  children: React.ReactNode;
}

const GameContainer: React.FC<GameContainerProps> = ({ children }) => {
  return <div className="game-container">{children}</div>; // You can style the container here.
};

export default GameContainer;
