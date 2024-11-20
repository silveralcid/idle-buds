import React from 'react';
import { useHunterStore } from '../stores/hunter.store';
import { useGameStore } from '../stores/game.store';
import { useBankStore } from '../stores/bank.store';

const HunterInfo = () => {
  const skills = useHunterStore((state) => state.skills);
  const currentActivity = useGameStore((state) => state.currentActivity);
  const resources = useBankStore((state) => state.resources);
  const party = useHunterStore((state) => state.party);

  return (
    <div className="space-y-4">
      {/* Current Activity */}
      <div>
        <h3 className="font-bold text-lg mb-2">Current Activity</h3>
        <div className="bg-base-200 p-2 rounded-lg">
          <div className="capitalize">Hunter Activity: {currentActivity || 'None'}</div>
          <div className="capitalize">Bud Activity: Placeholder for Bud Activity</div>
        </div>
      </div>

      {/* Bud Party Section */}
      <div>
        <h3 className="font-bold text-lg mb-2">Bud Party</h3>
        <div className="flex space-x-4">
          {party.map((bud) => (
            <div key={bud.id} className="text-center">
              <img src={bud.spriteRef} alt={bud.name} className="w-16 h-16 border" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div>
        <h3 className="font-bold text-lg mb-2">Stats</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Health: 100</div>
          <div>Wisdom: 50</div>
          <div>Attack: 75</div>
          <div>Defense: 60</div>
          <div>Dexterity: 80</div>
          <div>Points: 10</div>
        </div>
      </div>

      {/* Bank Section */}
      <div>
        <h3 className="font-bold text-lg mb-2">Bank</h3>
        <div className="space-y-1">
          {Object.entries(resources).map(([resourceName, amount]) => (
            <div key={resourceName} className="flex justify-between items-center text-sm bg-base-200 p-2 rounded-lg">
              <span className="capitalize">{resourceName}</span>
              <span>{amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <h3 className="font-bold text-lg mb-2">Skills</h3>
        <div className="space-y-2">
          {Object.entries(skills).map(([skillId, skill]) => (
            <div key={skillId} className="text-sm">
              <div className="flex justify-between items-center">
                <span className="capitalize">{skill.name}</span>
                <span>Lvl {skill.level}</span>
              </div>
              <progress
                className="progress progress-primary w-full h-1.5"
                value={skill.experience}
                max={skill.experienceToNextLevel}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HunterInfo;