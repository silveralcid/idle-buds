export const Sidebar = () => {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-bold text-lg mb-2">Actions</h2>
          <ul className="menu menu-lg bg-base-100 rounded-lg">
            <li><a>Shop</a></li>
            <li><a>Bank</a></li>
            <li><a>Buds</a></li>            
          </ul>
        </div>
  
        <div>
          <h2 className="font-bold text-lg mb-2">Combat</h2>
          <ul className="menu menu-lg bg-base-100 rounded-lg">
            <li><a>Level</a></li>
            <li><a>Attack</a></li>
            <li><a>Defense</a></li>
            <li><a>Health</a></li>            
            <li><a>Efficiency</a></li>
          </ul>
        </div>
        
        <div>
          <h2 className="font-bold text-lg mb-2">Passive</h2>
          <ul className="menu menu-lg bg-base-100 rounded-lg">
            <li><a>Farming</a></li>
          </ul>
        </div>
        
        <div>
          <h2 className="font-bold text-lg mb-2">Non-Combat</h2>
          <ul className="menu menu-lg bg-base-100 rounded-lg">
            <li><a>Woodcutting</a></li>
            <li><a>Fishing</a></li>
            <li><a>Cooking</a></li>
            <li><a>Mining</a></li>
            <li><a>Smithing</a></li>
            <li><a>Crafting</a></li>
          </ul>
        </div>
      </div>
    );
  };