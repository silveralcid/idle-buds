import React from 'react';
import { useEquipmentStore } from '../equipment.store';
import { useBankStore } from '../../bank/bank.store';
import { equipmentItem } from '../../../types/equipment.types';
import { SlotType } from '../../../enums/equipmentSlotType.enums';

export const EquipmentDisplay: React.FC = () => {
  const { equipped, unequipItem, getTotalStats } = useEquipmentStore();
  const totalStats = getTotalStats();

  const renderSlot = (slot: SlotType, label: string) => {
    const item = equipped[slot];

    return (
      <div 
        className="equipment-slot relative bg-base-300 rounded-lg p-2 w-16 h-16 flex items-center justify-center cursor-pointer hover:bg-base-200"
        onClick={() => item && unequipItem(slot)}
      >
        {item ? (
          <div className="text-center">
            <div className="text-xs font-bold">{item.name}</div>
            <div className="text-xs opacity-75">{label}</div>
          </div>
        ) : (
          <div className="text-xs opacity-50">{label}</div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-base-300 rounded-lg">
      <h2 className="text-xl font-bold">Equipment</h2>
      
      <div className="grid grid-cols-3 gap-4">
        {renderSlot('head', 'Head')}
        {renderSlot('body', 'Body')}
        {renderSlot('legs', 'Legs')}
        {renderSlot('1h-weapon', 'Weapon')}
        {renderSlot('shield', 'Shield')}
        {renderSlot('feet', 'Feet')}
      </div>

      <div className="mt-4 text-sm">
        <h3 className="font-bold mb-2">Equipment Bonuses:</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div>Attack: +{totalStats.attack}</div>
          <div>Defense: +{totalStats.defense}</div>
          <div>Health: +{totalStats.health}</div>
          <div>Intelligence: +{totalStats.intelligence}</div>
          <div>Dexterity: +{totalStats.dexterity}</div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDisplay;