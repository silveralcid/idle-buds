import React from 'react';

interface GameContainerProps {
  children: React.ReactNode;
}

const GameContainer = ({ children }: GameContainerProps) => {
    return (
        <div className="h-[calc(100vh-64px)] bg-base-300"> {/* Subtracting navbar height */}
          <div className="container mx-auto h-full p-4">
            <div className="grid grid-cols-12 gap-4 h-full">
              {/* Left Panel */}
              <div className="col-span-2 space-y-4">
                <div className="card bg-base-100 shadow-xl h-full">
                  <div className="card-body">
                    <h2 className="card-title">Hunter Info</h2>
                    {/* Hunter stats & resources */}
                  </div>
                </div>
              </div>
    
              {/* Main Game Area */}
              <div className="col-span-10"> {/* Increased from 8 to 10 */}
                <div className="card bg-base-100 shadow-xl h-full">
                  <div className="card-body">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
};
    

export default GameContainer;