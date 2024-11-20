import React from 'react';
import { useHunterStore } from '../stores/hunter.store';
import { useBankStore } from '../stores/bank.store'; // Import the bank store
import { createBudInstance } from '../factories/budFactory';
import { budSpecies } from '../data/buds/budSpecies.data';

const TestingView = () => {
  const { skills, setSkillLevel, setSkillExperience, addBudToParty, party } = useHunterStore();
  const { resources, addResource } = useBankStore(); // Access resources and addResource function

  const addRandomBudToParty = () => {
    const randomSpecies = budSpecies[Math.floor(Math.random() * budSpecies.length)];
    const newBud = createBudInstance(randomSpecies);
    addBudToParty(newBud);
  };

  const addFlatResource = (resourceName: string, amount: number) => {
    addResource(resourceName, amount);
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

      {/* Resource Section */}
      <div>
        <h2 className="text-xl font-semibold">Resources</h2>
        {Object.entries(resources).map(([resourceName, amount]) => (
          <div key={resourceName} className="flex items-center space-x-2">
            <span>{resourceName}</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => addFlatResource(resourceName, parseInt(e.target.value))}
              className="w-16 p-1 border rounded"
            />
          </div>
        ))}
      </div>

      {/* Bud Party Section */}
      <div>
        <h2 className="text-xl font-semibold">Bud Party</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Name</th>
              <th className="py-2">Level</th>
              <th className="py-2">Experience</th>
              <th className="py-2">Gender</th>
              <th className="py-2">Species ID</th>
              <th className="py-2">Description</th>
              <th className="py-2">Sprite</th>
              <th className="py-2">Allowed Tasks</th>
              <th className="py-2">Primary Affinity</th>
            </tr>
          </thead>
          <tbody>
            {party.map((bud) => (
              <tr key={bud.id} className="text-center">
                <td className="border px-4 py-2">{bud.id}</td>
                <td className="border px-4 py-2">{bud.name}</td>
                <td className="border px-4 py-2">{bud.level}</td>
                <td className="border px-4 py-2">{bud.experience}</td>
                <td className="border px-4 py-2">{bud.gender}</td>
                <td className="border px-4 py-2">{bud.speciesId}</td>
                <td className="border px-4 py-2">{bud.description}</td>
                <td className="border px-4 py-2">
                  <img src={bud.spriteRef} alt={bud.name} className="w-8 h-8 mx-auto" />
                </td>
                <td className="border px-4 py-2">{bud.allowedTasks.join(', ')}</td>
                <td className="border px-4 py-2">{bud.primaryAffinity}</td>
              </tr>
            ))}
          </tbody>
        </table>
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