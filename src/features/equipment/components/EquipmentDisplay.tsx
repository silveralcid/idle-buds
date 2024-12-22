export const EquipmentDisplay = () => {
    return (
      <div className="flex flex-col items-center gap-4 p-4 bg-base-300 rounded-lg">
        <h2 className="text-xl font-bold">Equipment</h2>
        
        <div className="grid grid-cols-3 gap-2 p-2">
          {/* Top Row */}
          <div className="equipment-slot"></div>
          <div className="equipment-slot">Head</div>
          <div className="equipment-slot"></div>
  
          {/* Middle Row */}
          <div className="equipment-slot">Weapon</div>
          <div className="equipment-slot">Body</div>
          <div className="equipment-slot">Shield</div>
  
          {/* Bottom Row */}
          <div className="equipment-slot">Ring</div>
          <div className="equipment-slot">Legs</div>
          <div className="equipment-slot">Amulet</div>
        </div>
      </div>
    );
  };
  
  const equipmentSlotStyle = {
    width: '60px',
    height: '60px',
    border: '2px solid #4a5568',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d3748',
    color: '#a0aec0',
    fontSize: '0.8rem'
  };

export default EquipmentDisplay;