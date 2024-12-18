import React, { useEffect } from "react";
import { useBudBoxStore } from "../features/budbox/budbox.store";
import { budSpecies } from "../data/buds/budSpecies.data";

const BudBoxView: React.FC = () => {
  const getAllBuds = useBudBoxStore(state => state.getAllBuds);
  const selectedBudId = useBudBoxStore(state => state.selectedBudId);
  const selectBud = useBudBoxStore(state => state.selectBud);
  const addBud = useBudBoxStore(state => state.addBud);

  const buds = getAllBuds();

  useEffect(() => {
    console.log('Current buds in store:', buds);
  }, [buds]);

  const handleGenerateRandomBud = () => {
    try {
      const randomIndex = Math.floor(Math.random() * budSpecies.length);
      const randomBudBase = budSpecies[randomIndex];
      console.log('Generating bud from base:', randomBudBase);
      addBud(randomBudBase);
      
      const updatedBuds = getAllBuds();
      console.log('Updated buds after generation:', updatedBuds);
    } catch (error) {
      console.error('Error generating bud:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">BudBox ({buds.length} Buds)</h1>
        <button
          onClick={handleGenerateRandomBud}
          className="btn btn-primary"
        >
          Generate Random Bud
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(buds) && buds.map((bud) => (
          <div
            key={bud.id}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              selectedBudId === bud.id
                ? "bg-primary text-primary-content"
                : "bg-base-200 hover:bg-base-300"
            }`}
            onClick={() => selectBud(selectedBudId === bud.id ? null : bud.id)}
          >
            <div className="flex items-center gap-4">
              <img
                src={bud.spriteRef}
                alt={bud.name}
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="font-bold text-lg">
                  {bud.nickname || bud.name}
                </h3>
                <p className="text-sm opacity-75">
                  Level {bud.level} | XP: {bud.experience}/{bud.experienceToNextLevel}
                </p>
                <p className="text-sm text-opacity-75 font-mono text-xs">
                  ID: {bud.id.slice(0, 8)}...
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!buds || buds.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No Buds found. Generate some Buds to get started!
        </div>
      )}
    </div>
  );
};

export default BudBoxView;
