import React, { useMemo, useCallback, useState } from 'react';
import { useBankStore } from '../../bank/bank.store';
import { useTendingStore } from '../tending.store';
import { usePartyStore } from '../../party/party.store';
import { eggHatchingData } from '../../../data/buds/eggHatching.data';
import { EggHatchData } from '../../../types/egg.types';
import { startHatching } from '../tending.logic';

const Hatchery: React.FC = () => {
  const [selectedEggId, setSelectedEggId] = useState<string>('');
  const activeHatching = useTendingStore(state => state.activeHatching);
  const bankItems = useBankStore(state => state.items);
  const tendingLevel = useTendingStore(state => state.level);
  const isPartyFull = usePartyStore(state => state.isPartyFull);

  // Memoize available eggs to prevent recalculation on every render
  const availableEggs = useMemo(() => 
    eggHatchingData.filter(egg => {
      const hasRequiredItems = egg.requirements.items?.every(item =>
        (bankItems[item.itemId] || 0) >= item.amount
      );
      const meetsLevelRequirement = tendingLevel >= egg.levelRequired;
      return hasRequiredItems && meetsLevelRequirement;
    }), [bankItems, tendingLevel]
  );

  const selectedEgg = useMemo(() => 
    eggHatchingData.find(egg => egg.id === selectedEggId),
    [selectedEggId]
  );

  const canStartHatching = useCallback((egg: EggHatchData): boolean => {
    if (isPartyFull()) return false;
    if (activeHatching) return false;
    return true;
  }, [isPartyFull, activeHatching]);

  const handleStartHatching = useCallback(() => {
    if (selectedEggId) {
      startHatching(selectedEggId);
    }
  }, [selectedEggId]);

  return (
    <div className="space-y-4">
      {/* Active Hatching Display */}
      {activeHatching && (
        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Currently Hatching</h3>
          <div className="w-full bg-base-300 rounded-full h-4">
            <div 
              className="bg-primary h-full rounded-full transition-all"
              style={{ 
                width: `${(activeHatching.progress / activeHatching.totalTicks) * 100}%` 
              }}
            />
          </div>
          <p className="mt-2">
            Progress: {Math.floor(activeHatching.progress)} / {activeHatching.totalTicks} ticks
          </p>
        </div>
      )}

      {/* Egg Selection */}
      <div className="bg-base-200 p-4 rounded-lg">
        <select
          value={selectedEggId}
          onChange={(e) => setSelectedEggId(e.target.value)}
          className="select select-bordered w-full mb-4"
          disabled={!!activeHatching}
        >
          <option value="">Select an egg to hatch</option>
          {availableEggs.map(egg => (
            <option key={egg.id} value={egg.id}>
              {egg.name}
            </option>
          ))}
        </select>

        {selectedEgg && (
          <div className="space-y-2">
            <p className="text-sm opacity-75">{selectedEgg.description}</p>
            
            <div>
              <h4 className="font-semibold">Requirements:</h4>
              <ul className="text-sm">
                {selectedEgg.requirements.items?.map(item => (
                  <li key={item.itemId} className="flex justify-between">
                    <span>{item.itemId}</span>
                    <span>{bankItems[item.itemId] || 0}/{item.amount}</span>
                  </li>
                ))}
                <li>Required Level: {selectedEgg.levelRequired}</li>
                <li>Hatch Time: {selectedEgg.hatchDuration} ticks</li>
              </ul>
            </div>

            <button
              className={`mt-4 btn btn-primary w-full ${
                !canStartHatching(selectedEgg) ? 'btn-disabled' : ''
              }`}
              onClick={handleStartHatching}
              disabled={!canStartHatching(selectedEgg)}
            >
              {isPartyFull() ? 'Party Full' : 'Start Hatching'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hatchery;
