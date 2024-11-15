import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-5rem)] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden hover:[&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-base-300">
      {/* Title */}
      <div className="sticky top-0 -mt-4 -mr-2 px-4 py-4 bg-base-200 z-20">
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>Idle Buds</h1>
      </div>

      <div>
        <ul className="menu menu-lg bg-base-100 rounded-lg">
          <li><a onClick={() => navigate('/store')}>Store</a></li>
          <li><a onClick={() => navigate('/inventory')}>Inventory</a></li>
          <li><a onClick={() => navigate('/bud-box')}>Bud Box</a></li>            
        </ul>
      </div>

      <div>
        <h2 className="font-bold text-lg mb-2">Combat</h2>
        <ul className="menu menu-lg bg-base-100 rounded-lg">
          <li><a onClick={() => navigate('/level')}>Level</a></li>
          <li><a onClick={() => navigate('/attack')}>Attack</a></li>
          <li><a onClick={() => navigate('/defense')}>Defense</a></li>
          <li><a onClick={() => navigate('/health')}>Health</a></li>            
          <li><a onClick={() => navigate('/efficiency')}>Efficiency</a></li>
        </ul>
      </div>
      
      <div>
        <h2 className="font-bold text-lg mb-2">Passive</h2>
        <ul className="menu menu-lg bg-base-100 rounded-lg">
          <li><a onClick={() => navigate('/farming')}>Farming</a></li>
        </ul>
      </div>
      
      <div>
        <h2 className="font-bold text-lg mb-2">Non-Combat</h2>
        <ul className="menu menu-lg bg-base-100 rounded-lg">
          <li><a onClick={() => navigate('/woodcutting')}>Woodcutting</a></li>
          <li><a onClick={() => navigate('/crafting')}>Crafting</a></li>
          <li><a onClick={() => navigate('/fishing')}>Fishing</a></li>
          <li><a onClick={() => navigate('/cooking')}>Cooking</a></li>
          <li><a onClick={() => navigate('/mining')}>Mining</a></li>
          <li><a onClick={() => navigate('/smithing')}>Smithing</a></li>
        </ul>
      </div>
      
      <div>
        <h2 className="font-bold text-lg mb-2">Other</h2>
        <ul className="menu menu-lg bg-base-100 rounded-lg">
          <li><a onClick={() => navigate('/completion-log')}>Completion Log</a></li>
          <li><a onClick={() => navigate('/lore')}>Lore</a></li>
          <li><a onClick={() => navigate('/statistics')}>Statistics</a></li>
          <li><a onClick={() => navigate('/settings')}>Settings</a></li>
          <li><a onClick={() => navigate('/news')}>News & Changelog</a></li>
        </ul>
      </div>
      
      <div>
        <h2 className="font-bold text-lg mb-2">Socials</h2>
        <ul className="menu menu-lg bg-base-100 rounded-lg">
          <li><a href="https://wiki.example.com" target="_blank" rel="noopener noreferrer">Wiki</a></li>
          <li><a href="https://patreon.com/example" target="_blank" rel="noopener noreferrer">Patreon</a></li>
          <li><a href="https://discord.gg/example" target="_blank" rel="noopener noreferrer">Discord</a></li>
          <li><a href="https://reddit.com/r/example" target="_blank" rel="noopener noreferrer">Reddit</a></li>
          <li><a href="https://twitter.com/example" target="_blank" rel="noopener noreferrer">Twitter</a></li>
        </ul>
      </div>
      <div>
        <h2 className="font-bold text-lg mb-2">Other</h2>
        <ul className="menu menu-lg bg-base-100 rounded-lg">
          <li><a onClick={() => navigate('/bug-report')}>Report a Bug</a></li>
          <li><a onClick={() => navigate('/privacy')}>Privacy Policy</a></li>
        </ul>
      </div>
      <p>Version 0</p>
    </div>
  );
};