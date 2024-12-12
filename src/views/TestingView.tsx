import React, { useState } from "react";
import { useBankStore } from "../features/bank/bank.store";
import { useSmithingStore } from "../features/smithing/smithing.store";
import { useMiningStore } from "../features/mining/mining.store";
import { useLumberingStore } from "../features/lumbering/lumbering.store";
import { useGameStore } from "../core/game.store";
import { miningItems } from "../data/items/ore.data";
import { lumberingItems } from "../data/items/log.data";
import { smeltedItems } from "../data/items/smelted.data";
import { melee } from "../data/items/melee.data";

const TestingView: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [itemAmount, setItemAmount] = useState<number>(0);
  const [selectedSkill, setSelectedSkill] = useState<string>("mining");
  const [skillLevel, setSkillLevel] = useState<number>(1);
  const [xpAmount, setXpAmount] = useState<number>(0);

  const bankStore = useBankStore();
  const smithingStore = useSmithingStore();
  const miningStore = useMiningStore();
  const lumberingStore = useLumberingStore();

  const allItems = [...miningItems, ...lumberingItems, ...smeltedItems, ...melee];

  const handleAddItem = () => {
    if (selectedItem && itemAmount > 0) {
      bankStore.addItem(selectedItem, itemAmount);
    }
  };

  const handleSkillLevelChange = () => {
    switch (selectedSkill) {
      case "smithing":
        smithingStore.setLevel(skillLevel);
        break;
      case "mining":
        miningStore.setLevel(skillLevel);
        break;
      case "lumbering":
        lumberingStore.setLevel(skillLevel);
        break;
    }
  };

  const handleAddXP = () => {
    switch (selectedSkill) {
      case "smithing":
        smithingStore.setXp(smithingStore.xp + xpAmount);
        break;
      case "mining":
        miningStore.setXp(miningStore.xp + xpAmount);
        break;
      case "lumbering":
        lumberingStore.setXp(lumberingStore.xp + xpAmount);
        break;
    }
  };

  const handleMaxLevel = () => {
    switch (selectedSkill) {
      case "smithing":
        smithingStore.setLevel(99);
        break;
      case "mining":
        miningStore.setLevel(99);
        break;
      case "lumbering":
        lumberingStore.setLevel(99);
        break;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Testing View</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Item Management */}
        <div className="p-4 bg-gray-200 rounded">
          <h2 className="font-semibold mb-2">Item Management</h2>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          >
            <option value="">Select Item</option>
            {allItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={itemAmount}
            onChange={(e) => setItemAmount(Number(e.target.value))}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Amount"
            min="0"
          />
          <div className="flex gap-2">
            <button 
              onClick={handleAddItem} 
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
            >
              Add Item
            </button>
          </div>
        </div>

        {/* Skill Management */}
        <div className="p-4 bg-gray-200 rounded">
          <h2 className="font-semibold mb-2">Skill Management</h2>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          >
            <option value="mining">Mining</option>
            <option value="smithing">Smithing</option>
            <option value="lumbering">Lumbering</option>
          </select>
          
          {/* Level Control */}
          <div className="mb-4">
            <input
              type="number"
              value={skillLevel}
              onChange={(e) => setSkillLevel(Number(e.target.value))}
              className="w-full mb-2 p-2 border rounded"
              placeholder="Skill Level"
              min="1"
              max="99"
            />
            <div className="flex gap-2">
              <button 
                onClick={handleSkillLevelChange}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white p-2 rounded"
              >
                Set Level
              </button>
              <button 
                onClick={handleMaxLevel}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white p-2 rounded"
              >
                Max Level
              </button>
            </div>
          </div>

          {/* XP Control */}
          <div>
            <input
              type="number"
              value={xpAmount}
              onChange={(e) => setXpAmount(Number(e.target.value))}
              className="w-full mb-2 p-2 border rounded"
              placeholder="XP Amount"
              min="0"
            />
            <button 
              onClick={handleAddXP}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
            >
              Add XP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingView;