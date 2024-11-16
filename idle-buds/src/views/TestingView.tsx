import React, { useState, useCallback, useMemo } from 'react';
import { useGameStore } from '../stores/useStore';
import { TREES } from '../data/trees';

// Memoized components to prevent unnecessary re-renders
const NumberInput = React.memo<{
  label: string;
  value: number;
  onChange: (value: string) => void;
}>(({ label, value, onChange }) => (
  <div className="form-control w-full">
    <div className="flex items-center gap-2">
      <label className="label-text flex-1">{label}</label>
      <input
        type="number"
        className="input input-bordered input-sm w-32"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
));

const SkillCard = React.memo<{
  title: string;
  fields: { label: string; value: number; path: string[] }[];
  onNumberChange: (path: string[], value: string) => void;
}>(({ title, fields, onNumberChange }) => (
  <div className="card bg-base-200 shadow-xl">
    <div className="card-body p-4">
      <h3 className="card-title text-lg mb-2">{title}</h3>
      <div className="space-y-2">
        {fields.map((field) => (
          <NumberInput
            key={field.label}
            label={field.label}
            value={field.value}
            onChange={(value) => onNumberChange(field.path, value)}
          />
        ))}
      </div>
    </div>
  </div>
));

const InventoryManager = React.memo<{
  inventory: Record<string, number>;
  onAddItem: (name: string, amount: number) => void;
  onUpdateItem: (name: string, amount: string) => void;
  onRemoveItem: (name: string) => void;
}>(({ inventory, onAddItem, onUpdateItem, onRemoveItem }) => (
  <div className="card bg-base-200 shadow-xl">
    <div className="card-body p-4">
      <h3 className="card-title text-lg mb-2">Inventory</h3>
      
      <div className="flex gap-2 mb-4">
        <select 
          className="select select-bordered select-sm flex-1"
          onChange={(e) => onAddItem(e.target.value, 1)}
        >
          <option value="">Add item...</option>
          {TREES.map(tree => (
            <option key={tree.id} value={tree.resourceName}>
              {tree.resourceName}
            </option>
          ))}
        </select>
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => onAddItem('normal_logs', 10)}
        >
          +10 Logs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {Object.entries(inventory).map(([item, amount]) => (
          <div key={item} className="flex items-center gap-2">
            <span className="label-text flex-1 truncate">{item}</span>
            <input
              type="number"
              className="input input-bordered input-sm w-24"
              value={amount}
              onChange={(e) => onUpdateItem(item, e.target.value)}
            />
            <button 
              className="btn btn-error btn-square btn-sm"
              onClick={() => onRemoveItem(item)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
));

export const Testing: React.FC = () => {
  const gameState = useGameStore();
  
  // Use useMemo to derive initial state
  const initialState = useMemo(() => ({
    level: gameState.level,
    experience: gameState.experience,
    woodcutting: {
      level: gameState.woodcutting.level,
      experience: gameState.woodcutting.experience,
    },
    inventory: { ...gameState.inventory }
  }), [gameState]);

  const [localState, setLocalState] = useState(initialState);

  // Memoize handlers to prevent unnecessary re-renders
  const handleNumberChange = useCallback((
    path: string[], 
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    
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
  }, []);

  // Memoize action handlers
  const applyChanges = useCallback(() => {
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
  }, [localState, gameState]);

  const resetChanges = useCallback(() => {
    setLocalState(initialState);
  }, [initialState]);

  const addInventoryItem = useCallback((resourceName: string, amount: number) => {
    setLocalState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [resourceName]: (prev.inventory[resourceName] || 0) + amount
      }
    }));
  }, []);

  return (
    <div className="p-4 space-y-4 pt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <SkillCard
          title="General Stats"
          fields={[
            { label: 'Level', value: localState.level, path: ['level'] },
            { label: 'Experience', value: localState.experience, path: ['experience'] }
          ]}
          onNumberChange={handleNumberChange}
        />

        <SkillCard
          title="Woodcutting"
          fields={[
            { label: 'Level', value: localState.woodcutting.level, path: ['woodcutting', 'level'] },
            { label: 'Experience', value: localState.woodcutting.experience, path: ['woodcutting', 'experience'] }
          ]}
          onNumberChange={handleNumberChange}
        />
      </div>

      <InventoryManager
        inventory={localState.inventory}
        onAddItem={addInventoryItem}
        onUpdateItem={(item, value) => handleNumberChange(['inventory', item], value)}
        onRemoveItem={(item) => setLocalState(prev => {
          const newInventory = { ...prev.inventory };
          delete newInventory[item];
          return { ...prev, inventory: newInventory };
        })}
      />

      <div className="flex gap-2 justify-end">
        <button 
          className="btn btn-error btn-sm"
          onClick={resetChanges}
        >
          Reset Changes
        </button>
        <button 
          className="btn btn-primary btn-sm"
          onClick={applyChanges}
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default Testing;