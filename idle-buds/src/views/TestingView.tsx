import React from 'react';
import { useHunterStore } from '../stores/hunter.store';
import { useGameStore } from '../stores/game.store';
import { createBudInstance } from '../factories/budFactory';
import { budSpecies } from '../data/buds/budSpecies.data';

const TestingView = () => {
  const { skills, setSkillLevel, setSkillExperience, addBudToParty } = useHunterStore();
  const { resources, startGathering, stopGathering } = useGameStore();

  const addRandomBudToParty = () => {
    const randomSpecies = budSpecies[Math.floor(Math.random() * budSpecies.length)];
    const newBud = createBudInstance(randomSpecies, `bud-${Date.now()}`);
    addBudToParty(newBud);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Testing Page</h1>

      {/* Skill Testing Section */}
      <div>
        <h2 className="text-xl font-semibold">Skills</h2>
        {Object.entries(skills).map(([skillId, skill]) => (
          <div key={skillId} className="flex items-center space-x-2">
            <span>{skill.name}</span>
            <input
              type="number"
              value={skill.level}
              onChange={(e) => setSkillLevel(skillId, parseInt(e.target.value))}
              className="w-16 p-1 border rounded"
            />
            <input
              type="number"
              value={skill.experience}
              onChange={(e) => setSkillExperience(skillId, parseInt(e.target.value))}
              className="w-16 p-1 border rounded"
            />
          </div>
        ))}
      </div>

      {/* Resource Testing Section */}
      <div>
        <h2 className="text-xl font-semibold">Resources</h2>
        {Object.entries(resources).map(([resourceName, amount]) => (
          <div key={resourceName} className="flex items-center space-x-2">
            <span>{resourceName}</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => console.log(`Set ${resourceName} to ${e.target.value}`)}
              className="w-16 p-1 border rounded"
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="space-x-2">
        <button onClick={addRandomBudToParty} className="p-2 bg-green-500 text-white rounded">
          Add Random Bud to Party
        </button>
      </div>
    </div>
  );
};

export default TestingView;