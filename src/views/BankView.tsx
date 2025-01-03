import React, { useState } from "react";
import { useBankStore } from "../features/bank/bank.store";
import { useEquipmentStore } from "../features/equipment/equipment.store";
import { currencyItems } from "../data/items/currency.data";
import { miningItems } from "../data/items/ore.data";
import { lumberingItems } from "../data/items/log.data";
import { smeltedItems } from "../data/items/smelted.data";
import { armor } from "../data/items/armor.data";
import { melee } from "../data/items/melee.data";
import { equipmentItem } from "../types/equipment.types";

const BankView: React.FC = () => {
  const items = useBankStore((state) => state.items);
  const removeItem = useBankStore((state) => state.removeItem);
  const addItem = useBankStore((state) => state.addItem);
  const equipItem = useEquipmentStore((state) => state.equipItem);
  const [deleteAmounts, setDeleteAmounts] = useState<Record<string, number>>({});

  const allItems = [...currencyItems, ...miningItems, ...lumberingItems, ...smeltedItems, ...armor, ...melee];
  
  const isEquippable = (itemId: string): equipmentItem | undefined => {
    return [...armor, ...melee].find(item => item.id === itemId);
  };

  const handleEquip = (itemId: string) => {
    const equipmentItem = isEquippable(itemId);
    if (equipmentItem) {
      equipItem(equipmentItem);
    }
  };

  const getItemValue = (itemId: string) => {
    const item = allItems.find(item => item.id === itemId);
    return item ? item.value : 0;
  };

  const handleDeleteChange = (itemId: string, amount: number) => {
    setDeleteAmounts((prev) => ({ ...prev, [itemId]: amount }));
  };

  const handleDelete = (itemId: string) => {
    const amount = deleteAmounts[itemId] || 0;
    removeItem(itemId, amount);
  };

  const handleDeleteAll = (itemId: string) => {
    const quantity = items[itemId] || 0;
    removeItem(itemId, quantity);
  };

  const handleSell = (itemId: string) => {
    const amount = deleteAmounts[itemId] || 0;
    const itemValue = getItemValue(itemId);
    const totalValue = itemValue * amount;
    removeItem(itemId, amount);
    addItem('gold_coin', totalValue);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bank View</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(items).map(([itemId, quantity]) => {
          const isItemEquippable = isEquippable(itemId);
          
          return (
            <div key={itemId} className="p-2 border rounded">
              <p>{itemId}: {quantity}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <input
                  type="number"
                  min="0"
                  value={deleteAmounts[itemId] || ""}
                  onChange={(e) => handleDeleteChange(itemId, parseInt(e.target.value, 10))}
                  className="border p-1"
                />
                {isItemEquippable && (
                  <button
                    onClick={() => handleEquip(itemId)}
                    className="bg-blue-500 text-white p-1 rounded"
                  >
                    Equip
                  </button>
                )}
                <button
                  onClick={() => handleDelete(itemId)}
                  className="ml-2 bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleDeleteAll(itemId)}
                  className="ml-2 bg-red-700 text-white p-1 rounded"
                >
                  Delete All
                </button>
                <button
                  onClick={() => handleSell(itemId)}
                  className="ml-2 bg-green-500 text-white p-1 rounded"
                >
                  Sell
                </button>
                <button
                  onClick={() => {
                    const wholeQuantity = Math.floor(quantity);
                    if (wholeQuantity > 0 && itemId !== 'gold_coin') {
                      const itemValue = getItemValue(itemId);
                      const totalValue = itemValue * wholeQuantity;
                      removeItem(itemId, wholeQuantity);
                      addItem('gold_coin', totalValue);
                    }
                  }}
                  className="ml-2 bg-green-700 text-white p-1 rounded"
                  disabled={itemId === 'gold_coin'}
                >
                  Sell All
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BankView;
