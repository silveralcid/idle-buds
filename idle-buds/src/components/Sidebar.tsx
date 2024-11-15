import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Define themes array
const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave",
  "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua",
  "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula",
  "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee",
  "winter", "dim", "nord", "sunset"
] as const;

type Theme = typeof THEMES[number];

export const Sidebar = () => {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const htmlTheme = document.documentElement.getAttribute('data-theme') as Theme;
    return htmlTheme || 'fantasy';
  });

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      handleThemeChange(savedTheme);
    }
  }, []);

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-5rem)] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden hover:[&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-base-300">
      {/* Title and Theme Selector */}
      <div className="sticky top-0 -mt-4 -mr-2 px-4 py-4 bg-base-200 z-20">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold cursor-pointer text-center" onClick={() => navigate('/')}>
            Idle Buds
          </h1>
          <select 
            className="select select-sm select-bordered w-full"
            value={currentTheme}
            onChange={(e) => handleThemeChange(e.target.value as Theme)}
          >
            {THEMES.map((theme) => (
              <option key={theme} value={theme}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </option>
            ))}
          </select>
        </div>
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
          <li><a onClick={() => navigate('/completion-log')}>Achievements</a></li>
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