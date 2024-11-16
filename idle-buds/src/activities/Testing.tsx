// src/activities/Testing.tsx
import React, { useState } from 'react';
import { useGameStore } from '../stores/useStore';
import { TREES } from '../data/trees';

export const Testing: React.FC = () => {
  const gameState = useGameStore();
  const [localState, setLocalState] = useState({
    level: gameState.level,
    experience: gameState.experience,
    woodcutting: {
      level: gameState.woodcutting.level,
      experience: gameState.woodcutting.experience,
    },
    inventory: { ...gameState.inventory }
  });

  // Handle number input changes
  const handleNumberChange = (
    path: string[], 
    value: string, 
    setter: (value: number) => void
  ) => {
    const numValue = parseInt(value) || 0;
    setter(numValue);
    
    // Update local state
    setLocalState(prev => {
      const newState = { ...prev };
      let current: any = newState;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = numValue;
      return newState;
    });
  };

  // Apply changes to game state
  const applyChanges = () => {
    // Update experience and levels
    useGameStore.setState({
      level: localState.level,
      experience: localState.experience,
      woodcutting: {
        ...gameState.woodcutting,
        level: localState.woodcutting.level,
        experience: localState.woodcutting.experience,
      },
      inventory: localState.inventory
    });
  };

  // Reset to current game state
  const resetChanges = () => {
    setLocalState({
      level: gameState.level,
      experience: gameState.experience,
      woodcutting: {
        level: gameState.woodcutting.level,
        experience: gameState.woodcutting.experience,
      },
      inventory: { ...gameState.inventory }
    });
  };

  // Add item to inventory
  const addInventoryItem = (resourceName: string, amount: number) => {
    setLocalState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [resourceName]: (prev.inventory[resourceName] || 0) + amount
      }
    }));
  };

  return (
    <div className="p-4 space-y-6 pt-16">
      {/* General Stats */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">General Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Level</span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={localState.level}
                onChange={(e) => handleNumberChange(['level'], e.target.value, 
                  (value) => setLocalState(prev => ({ ...prev, level: value }))
                )}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Experience</span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={localState.experience}
                onChange={(e) => handleNumberChange(['experience'], e.target.value,
                  (value) => setLocalState(prev => ({ ...prev, experience: value }))
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Woodcutting Stats */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Woodcutting</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Level</span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={localState.woodcutting.level}
                onChange={(e) => handleNumberChange(['woodcutting', 'level'], e.target.value,
                  (value) => setLocalState(prev => ({
                    ...prev,
                    woodcutting: { ...prev.woodcutting, level: value }
                  }))
                )}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Experience</span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={localState.woodcutting.experience}
                onChange={(e) => handleNumberChange(['woodcutting', 'experience'], e.target.value,
                  (value) => setLocalState(prev => ({
                    ...prev,
                    woodcutting: { ...prev.woodcutting, experience: value }
                  }))
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Management */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Inventory</h2>
          
          {/* Add items section */}
          <div className="flex gap-4 mb-4">
            <select 
              className="select select-bordered flex-1"
              onChange={(e) => addInventoryItem(e.target.value, 1)}
            >
              <option value="">Select resource to add...</option>
              {TREES.map(tree => (
                <option key={tree.id} value={tree.resourceName}>
                  {tree.resourceName}
                </option>
              ))}
            </select>
            <button 
              className="btn btn-primary"
              onClick={() => addInventoryItem('normal_logs', 10)}
            >
              Add 10 Normal Logs
            </button>
          </div>

          {/* Current inventory */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(localState.inventory).map(([item, amount]) => (
              <div key={item} className="form-control">
                <label className="label">
                  <span className="label-text">{item}</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="input input-bordered flex-1"
                    value={amount}
                    onChange={(e) => handleNumberChange(['inventory', item], e.target.value,
                      (value) => setLocalState(prev => ({
                        ...prev,
                        inventory: { ...prev.inventory, [item]: value }
                      }))
                    )}
                  />
                  <button 
                    className="btn btn-error btn-square"
                    onClick={() => setLocalState(prev => {
                      const newInventory = { ...prev.inventory };
                      delete newInventory[item];
                      return { ...prev, inventory: newInventory };
                    })}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <button 
          className="btn btn-error"
          onClick={resetChanges}
        >
          Reset Changes
        </button>
        <button 
          className="btn btn-primary"
          onClick={applyChanges}
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default Testing;
