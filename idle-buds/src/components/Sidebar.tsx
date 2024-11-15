export const Sidebar = () => {
  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-5rem)] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden hover:[&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-base-300">
      {/* Title */}
      <div className="sticky top-0 -mt-4 -mr-2 px-4 py-4 bg-base-200 z-20">
        <h1 className="text-2xl font-bold">Idle Buds</h1>
      </div>

      <div>
        <ul className="menu menu-lg bg-base-100 rounded-lg">
          <li><a>Store</a></li>
          <li><a>Inventory</a></li>
          <li><a>Bud Box</a></li>            
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
      
      {/* Rest of the sidebar content remains the same */}
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
          <li><a>Refining</a></li>
          <li><a>Crafting</a></li>
        </ul>
      </div>
      
      <div>
        <h2 className="font-bold text-lg mb-2">Other</h2>
        <ul className="menu menu-lg bg-base-100 rounded-lg">
          <li><a>Completion Log</a></li>
          <li><a>Lore</a></li>
          <li><a>Statistics</a></li>
          <li><a>Settings</a></li>
          <li><a>News & Changelog</a></li>
        </ul>
      </div>
      
      <div>
        <h2 className="font-bold text-lg mb-2">Socials</h2>
        <ul className="menu menu-lg bg-base-100 rounded-lg">
          <li><a>Wiki</a></li>
          <li><a>Patreon</a></li>
          <li><a>Discord</a></li>
          <li><a>Reddit</a></li>
          <li><a>Twitter</a></li>
        </ul>
      </div>
      <div>
        <h2 className="font-bold text-lg mb-2">Other</h2>
        <ul className="menu menu-lg bg-base-100 rounded-lg">
          <li><a>Report a Bug</a></li>
          <li><a>Privacy Policy</a></li>
        </ul>
      </div>
      <p>Version 0</p>
    </div>
  );
};