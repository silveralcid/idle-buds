import React, { useMemo, useCallback } from 'react';
import { useBankStore } from '../../bank/bank.store';
import { useTendingStore } from '../tending.store';
import { usePartyStore } from '../../party/party.store';
import { eggHatchingData } from '../../../data/buds/eggHatching.data';
import { EggHatchData } from '../../../types/egg.types';
import { startHatching } from '../tending.logic';

const Hatchery: React.FC = () => {
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

  const canStartHatching = useCallback((egg: EggHatchData): boolean => {
    if (isPartyFull()) return false;
    if (activeHatching) return false;
    return true;
  }, [isPartyFull, activeHatching]);

  const handleStartHatching = useCallback((egg: EggHatchData) => {
    startHatching(egg.id);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Active Hatching Display */}
      {activeHatching && (
        <div className="col-span-full bg-base-200 p-4 rounded-lg">
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

      {/* Available Eggs List */}
      {availableEggs.map(egg => (
        <div key={egg.id} className="bg-base-200 p-4 rounded-lg">
          <h3 className="font-bold">{egg.name}</h3>
          <p className="text-sm opacity-75">{egg.description}</p>
          
          <div className="mt-2">
            <h4 className="font-semibold">Requirements:</h4>
            <ul className="text-sm">
              {egg.requirements.items?.map(item => (
                <li key={item.itemId} className="flex justify-between">
                  <span>{item.itemId}</span>
                  <span>{bankItems[item.itemId] || 0}/{item.amount}</span>
                </li>
              ))}
              <li>Required Level: {egg.levelRequired}</li>
              <li>Hatch Time: {egg.hatchDuration} ticks</li>
            </ul>
          </div>

          <button
            className={`mt-4 btn btn-primary w-full ${
              !canStartHatching(egg) ? 'btn-disabled' : ''
            }`}
            onClick={() => handleStartHatching(egg)}
            disabled={!canStartHatching(egg)}
          >
            {isPartyFull() ? 'Party Full' : 'Start Hatching'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Hatchery;
