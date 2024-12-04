import React from "react";

interface GameContainerProps {
  children: React.ReactNode;
}

const GameContainer: React.FC<GameContainerProps> = ({ children }) => {
  return <div className="p-4 bg-base-100">{children}</div>; // Styled container for your views
};

export default GameContainer;

