import React from 'react';

interface NavbarDropdownEquipmentProps {
  isOpen?: boolean;
}

const NavbarDropdownEquipment: React.FC<NavbarDropdownEquipmentProps> = () => {
  return (
    <div className="dropdown dropdown-end dropdown-bottom">
      <div tabIndex={0} role="button" className="btn btn-primary">
        Equipment
      </div>
      <div 
        tabIndex={0} 
        className="dropdown-content z-[1] card card-compact w-96 p-2 shadow-lg bg-base-100"
      >
        <div className="card-body">
          {/* Header */}
          <h3 className="card-title">Equipment</h3>
          
          {/* Equipment Slots Section */}
          <div className="grid grid-cols-3 gap-2">
            {/* Head Slot */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-base-300 rounded-lg flex items-center justify-center">
                <span className="text-xs text-center">Head</span>
              </div>
            </div>

            {/* Neck Slot */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-base-300 rounded-lg flex items-center justify-center">
                <span className="text-xs text-center">Neck</span>
              </div>
            </div>

            {/* Cape Slot */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-base-300 rounded-lg flex items-center justify-center">
                <span className="text-xs text-center">Cape</span>
              </div>
            </div>

            {/* Weapon Slot */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-base-300 rounded-lg flex items-center justify-center">
                <span className="text-xs text-center">Weapon</span>
              </div>
            </div>

            {/* Body Slot */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-base-300 rounded-lg flex items-center justify-center">
                <span className="text-xs text-center">Body</span>
              </div>
            </div>

            {/* Shield Slot */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-base-300 rounded-lg flex items-center justify-center">
                <span className="text-xs text-center">Shield</span>
              </div>
            </div>

            {/* Legs Slot */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-base-300 rounded-lg flex items-center justify-center">
                <span className="text-xs text-center">Legs</span>
              </div>
            </div>

            {/* Feet Slot */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-base-300 rounded-lg flex items-center justify-center">
                <span className="text-xs text-center">Feet</span>
              </div>
            </div>

            {/* Ring Slot */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-base-300 rounded-lg flex items-center justify-center">
                <span className="text-xs text-center">Ring</span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="divider my-2">Stats</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="stat-value text-sm">Attack: 0</div>
            <div className="stat-value text-sm">Defense: 0</div>
            <div className="stat-value text-sm">Strength: 0</div>
            <div className="stat-value text-sm">Magic: 0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarDropdownEquipment;