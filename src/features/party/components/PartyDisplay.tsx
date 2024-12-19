import React, { useState, useMemo } from 'react';
import { usePartyStore } from '../party.store';
import { useBudBoxStore } from '../../budbox/budbox.store';

const PartyDisplay: React.FC = () => {
  const [hoveredBudId, setHoveredBudId] = useState<string | null>(null);
  const budsObject = usePartyStore(state => state.buds);
  const removeBudFromParty = usePartyStore(state => state.removeBud);
  const createBud = useBudBoxStore(state => state.createBud);
  const addToBudBox = useBudBoxStore(state => state.addBud);

  // Memoize the buds array
  const partyBuds = useMemo(() => Object.values(budsObject), [budsObject]);

  const handleTransferToBudBox = (budId: string) => {
    const bud = partyBuds.find(b => b.id === budId);
    if (bud) {
      removeBudFromParty(budId);
      addToBudBox(bud);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-md font-semibold mb-2">Party Members</h3>
      <div className="grid grid-cols-2 gap-2">
        {partyBuds.map((bud) => (
          <div
            key={bud.id}
            className="relative bg-base-200 rounded-lg p-2 transition-all duration-200 hover:bg-base-300"
            onMouseEnter={() => setHoveredBudId(bud.id)}
            onMouseLeave={() => setHoveredBudId(null)}
          >
            <img
              src={bud.spriteRef}
              alt={bud.name}
              className="w-12 h-12 object-contain mx-auto"
            />
            <div className="text-center mt-1">
              <span className="bg-primary text-primary-content px-2 py-0.5 rounded-full text-xs">
                Lvl {bud.level}
              </span>
            </div>

            {/* Hover Details */}
            {hoveredBudId === bud.id && (
              <div className="absolute left-0 right-0 -bottom-24 z-10 bg-base-300 rounded-lg p-2 shadow-lg">
                <p className="text-sm font-semibold">{bud.name}</p>
                <p className="text-xs opacity-75">ID: {bud.id.slice(0, 8)}...</p>
                <p className="text-xs">XP: {bud.experience}/{bud.experienceToNextLevel}</p>
                <button
                  onClick={() => handleTransferToBudBox(bud.id)}
                  className="w-full mt-1 text-xs bg-secondary hover:bg-secondary-focus text-secondary-content px-2 py-1 rounded transition-colors"
                >
                  Move to BudBox
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {partyBuds.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No Buds in party
        </div>
      )}
    </div>
  );
};

export default PartyDisplay;
