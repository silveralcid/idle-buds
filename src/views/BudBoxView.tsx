import React, { useMemo } from "react";
import { useBudBoxStore } from "../features/budbox/budbox.store";
import { usePartyStore } from "../features/party/party.store";
import { budSpecies } from "../data/buds/budSpecies.data";

const BudBoxView: React.FC = () => {
  // Get the raw buds object from the store
  const budsObject = useBudBoxStore(state => state.buds);
  const selectedBudId = useBudBoxStore(state => state.selectedBudId);
  const selectBud = useBudBoxStore(state => state.selectBud);
  const createBud = useBudBoxStore(state => state.createBud);
  const removeBud = useBudBoxStore(state => state.removeBud);
  const deleteAllBuds = useBudBoxStore(state => state.deleteAllBuds);

  // Party store hooks
  const addToBudParty = usePartyStore(state => state.addBud);
  const isPartyFull = usePartyStore(state => state.isPartyFull);

  // Memoize the buds array
  const buds = useMemo(() => Object.values(budsObject), [budsObject]);

  const handleTransferToParty = (budId: string) => {
    try {
      if (isPartyFull()) {
        return;
      }

      const bud = budsObject[budId];
      if (!bud) return;

      const success = addToBudParty(bud);
      if (success) {
        removeBud(budId);
      }
    } catch (error) {
      console.error('Error transferring bud to party:', error);
    }
  };

  const handleGenerateRandomBud = () => {
    try {
      const randomIndex = Math.floor(Math.random() * budSpecies.length);
      const randomBudBase = budSpecies[randomIndex];
      createBud(randomBudBase);
    } catch (error) {
      console.error('Error generating bud:', error);
    }
  };

  const handleDeleteAllBuds = () => {
    if (window.confirm('Are you sure you want to delete all buds? This cannot be undone.')) {
      deleteAllBuds();
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">BudBox ({buds.length} Buds)</h1>
        <div className="flex gap-2">
          <button
            onClick={handleDeleteAllBuds}
            className="btn btn-error"
          >
            Delete All
          </button>
          <button
            onClick={handleGenerateRandomBud}
            className="btn btn-primary"
          >
            Generate Random Bud
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {buds.map((bud) => (
          <div
            key={bud.id}
            className={`p-4 rounded-lg cursor-pointer transition-all relative ${
              selectedBudId === bud.id
                ? "bg-primary text-primary-content"
                : "bg-base-200 hover:bg-base-300"
            }`}
            onClick={() => selectBud(selectedBudId === bud.id ? null : bud.id)}
          >
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTransferToParty(bud.id);
                }}
                disabled={isPartyFull()}
                className="px-2 py-1 text-xs rounded-full bg-secondary hover:bg-secondary-focus disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                title={isPartyFull() ? "Party is full" : "Move to Party"}
              >
                To Party
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeBud(bud.id);
                }}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-500 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
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

      {buds.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No Buds found. Generate some Buds to get started!
        </div>
      )}
    </div>
  );
};

export default BudBoxView;
