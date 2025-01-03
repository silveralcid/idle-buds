import React, { useState, useMemo } from "react";
import { useBankStore } from "../features/bank/bank.store";
import { useSmithingStore } from "../features/smithing/smithing.store";
import { useMiningStore } from "../features/mining/mining.store";
import { useLumberingStore } from "../features/lumbering/lumbering.store";
import { useTendingStore } from "../features/tending/tending.store";
import { usePartyStore } from "../features/party/party.store";
import { useBudBoxStore } from "../features/budbox/budbox.store";
import { budInstance } from "../types/budInstance.types";
import { miningItems } from "../data/items/ore.data";
import { lumberingItems } from "../data/items/log.data";
import { smeltedItems } from "../data/items/smelted.data";
import { melee } from "../data/items/melee.data";
import { eggItems } from "../data/buds/eggItems.data";
import { GameConfig } from "../core/constants/game-config";
import { useCombatStore } from "../features/combat/combat.store";

const LevelControls: React.FC<{
  budId: string;
  currentLevel: number;
  onAdjustLevel: (budId: string, newLevel: number) => void;
}> = ({ budId, currentLevel, onAdjustLevel }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onAdjustLevel(budId, currentLevel - 1)}
        disabled={currentLevel <= 1}
        className="btn btn-xs btn-circle"
      >
        -
      </button>
      <span className="text-sm">{currentLevel}</span>
      <button
        onClick={() => onAdjustLevel(budId, currentLevel + 1)}
        disabled={currentLevel >= 100}
        className="btn btn-xs btn-circle"
      >
        +
      </button>
      <button
        onClick={() => onAdjustLevel(budId, 100)}
        disabled={currentLevel >= 100}
        className="btn btn-xs"
      >
        Max
      </button>
    </div>
  );
};

const TestingView: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [itemAmount, setItemAmount] = useState<number>(0);
  const [selectedSkill, setSelectedSkill] = useState<string>("mining");
  const [skillLevel, setSkillLevel] = useState<number>(1);
  const [xpAmount, setXpAmount] = useState<number>(0);
  const [selectedBudId, setSelectedBudId] = useState<string>("");

  const bankStore = useBankStore();
  const smithingStore = useSmithingStore();
  const miningStore = useMiningStore();
  const lumberingStore = useLumberingStore();
  const tendingStore = useTendingStore();
  const combatStore = useCombatStore();

  const partyBuds = usePartyStore(state => state.buds);
  const budboxBuds = useBudBoxStore(state => state.buds);

  const partyBudsList = useMemo(() => Object.values(partyBuds), [partyBuds]);
  const budboxBudsList = useMemo(() => Object.values(budboxBuds), [budboxBuds]);
  const selectedBud = useMemo(() => 
    budboxBuds[selectedBudId], [selectedBudId, budboxBuds]
  );

  const allItems = [...miningItems, ...lumberingItems, ...smeltedItems, ...melee, ...eggItems];

  const handleAddItem = () => {
    if (selectedItem && itemAmount > 0) {
      bankStore.addItem(selectedItem, itemAmount);
    }
  };

  const handleSkillLevelChange = () => {
    switch (selectedSkill) {
      case "combat":
        combatStore.setLevel(skillLevel);
        break;
      case "smithing":
        smithingStore.setLevel(skillLevel);
        break;
      case "mining":
        miningStore.setLevel(skillLevel);
        break;
      case "lumbering":
        lumberingStore.setLevel(skillLevel);
        break;
      case "tending":
        tendingStore.setLevel(skillLevel);
    }
  };

  const handleSetXP = () => {
    switch (selectedSkill) {
      case "combat":
        combatStore.setXp(xpAmount);
        break;
      case "smithing":
        smithingStore.setXp(xpAmount);
        break;
      case "mining":
        miningStore.setXp(xpAmount);
        break;
      case "lumbering":
        lumberingStore.setXp(xpAmount);
        break;
      case "tending":
        tendingStore.setXp(xpAmount);
        break;
    }
  };

  const handleMaxLevel = () => {
    switch (selectedSkill) {
      case "combat":
        combatStore.setLevel(GameConfig.EXPERIENCE.MAX_LEVEL)
        break;
      case "smithing":
        smithingStore.setLevel(GameConfig.EXPERIENCE.MAX_LEVEL);
        break;
      case "mining":
        miningStore.setLevel(GameConfig.EXPERIENCE.MAX_LEVEL);
        break;
      case "lumbering":
        lumberingStore.setLevel(GameConfig.EXPERIENCE.MAX_LEVEL);
        break;
      case "tending":
        tendingStore.setLevel(GameConfig.EXPERIENCE.MAX_LEVEL);
        break;
    }
  };

  const adjustPartyBudLevel = usePartyStore(state => state.adjustBudLevel);
  const adjustBudBoxBudLevel = useBudBoxStore(state => state.adjustBudLevel);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Testing View</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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
            <option value="combat">Combat</option>
            <option value="mining">Mining</option>
            <option value="smithing">Smithing</option>
            <option value="lumbering">Lumbering</option>
            <option value="tending">Tending</option>
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
              onClick={handleSetXP}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
            >
              Set XP
            </button>
          </div>
        </div>
      </div>

      {/* New Bud Testing Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Party Buds Table */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Party Buds</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Level</th>
                  <th>XP</th>
                  <th>Affinity</th>
                  <th>Gender</th>
                </tr>
              </thead>
              <tbody>
                {partyBudsList.map((bud) => (
                  <tr key={bud.id}>
                    <td>{bud.id}</td>
                    <td>
                      <LevelControls
                        budId={bud.id}
                        currentLevel={bud.level}
                        onAdjustLevel={adjustPartyBudLevel}
                      />
                    </td>
                    <td>{bud.experience}/{bud.experienceToNextLevel}</td>
                    <td>{bud.primaryAffinity}</td>
                    <td>{bud.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BudBox Selection and Details */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">BudBox Inspector</h2>
          <select
            value={selectedBudId}
            onChange={(e) => setSelectedBudId(e.target.value)}
            className="select select-bordered w-full mb-4"
          >
            <option value="">Select a Bud</option>
            {budboxBudsList.map((bud) => (
              <option key={bud.id} value={bud.id}>
                {bud.nickname || bud.name} (ID: {bud.id.slice(0, 8)}...)
              </option>
            ))}
          </select>

          {selectedBud ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <tbody>
                  <tr>
                    <td className="font-bold">ID</td>
                    <td>{selectedBud.id}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Species</td>
                    <td>{selectedBud.name}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Nickname</td>
                    <td>{selectedBud.nickname || "None"}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Level</td>
                    <td>
                      <LevelControls
                        budId={selectedBud.id}
                        currentLevel={selectedBud.level}
                        onAdjustLevel={adjustBudBoxBudLevel}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">Experience</td>
                    <td>{selectedBud.experience}/{selectedBud.experienceToNextLevel}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Affinity</td>
                    <td>{selectedBud.primaryAffinity}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Gender</td>
                    <td>{selectedBud.gender}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Allowed Tasks</td>
                    <td>{selectedBud.allowedTasks.join(", ")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a Bud to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestingView;