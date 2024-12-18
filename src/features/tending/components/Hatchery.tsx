import React, { useState, useEffect } from 'react';
import { useBankStore } from '../../bank/bank.store';
import { useTendingStore } from '../tending.store';
import { usePartyStore } from '../../party/party.store';
import { eggHatchingData } from '../../../data/buds/eggHatching.data';
import { EggHatchData } from '../../../types/egg.types';
import { GameConfig } from '../../../core/constants/game-config';

interface HatchingProgress {
  eggId: string;
  progress: number;
  totalTicks: number;
}

const Hatchery: React.FC = () => {
  const [activeHatching, setActiveHatching] = useState<HatchingProgress | null>(null);
  const bankItems = useBankStore(state => state.items);
  const removeItem = useBankStore(state => state.removeItem);
  const tendingLevel = useTendingStore(state => state.level);
  const setTendingXp = useTendingStore(state => state.setXp);
  const tendingXp = useTendingStore(state => state.xp);
  const isPartyFull = usePartyStore(state => state.isPartyFull);
  const addToParty = usePartyStore(state => state.addBud);

  const availableEggs = eggHatchingData.filter(egg => {
    const hasRequiredItems = egg.requirements.items?.every(item =>
      (bankItems[item.itemId] || 0) >= item.amount
    );
    const meetsLevelRequirement = tendingLevel >= egg.levelRequired;
    return hasRequiredItems && meetsLevelRequirement;
  });

  const canStartHatching = (egg: EggHatchData): boolean => {
    if (isPartyFull()) return false;
    if (activeHatching) return false;
    return true;
  };

  const startHatching = (egg: EggHatchData) => {
    if (!canStartHatching(egg)) return;

    // Consume required items
    egg.requirements.items?.forEach(item => {
      removeItem(item.itemId, item.amount);
    });

    setActiveHatching({
      eggId: egg.id,
      progress: 0,
      totalTicks: egg.hatchDuration
    });
  };

  const handleStartHatching = (egg: EggHatchData) => {
    startHatching(egg);
  };

  useEffect(() => {
    if (!activeHatching) return;

    const interval = setInterval(() => {
      setActiveHatching(current => {
        if (!current) return null;
        
        const tickProgress = GameConfig.TICK.RATE.DEFAULT;
        const newProgress = current.progress + tickProgress;

        if (newProgress >= current.totalTicks) {
          // Hatching complete
          const eggData = eggHatchingData.find(e => e.id === current.eggId);
          if (eggData) {
            // Award XP
            const newXp = tendingXp + eggData.experienceReward;
            setTendingXp(newXp);

            // TODO: Generate new bud and add to party
            // Implementation needed based on your bud generation logic
          }
          return null;
        }

        return {
          ...current,
          progress: newProgress
        };
      });
    }, 1000 / GameConfig.TICK.RATE.DEFAULT); // Adjust interval based on tick rate

    return () => clearInterval(interval);
  }, [activeHatching, tendingXp, setTendingXp]);

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
