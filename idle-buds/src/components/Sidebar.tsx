import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ROUTES, ROUTE_ICONS, ROUTE_TITLES } from '../constants/routeMappings';

const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave",
  "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua",
  "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula",
  "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee",
  "winter", "dim", "nord", "sunset"
] as const;

type Theme = typeof THEMES[number];

interface MenuItemProps {
  route: string;
  onClick: () => void;
}

const MenuItem: FC<MenuItemProps> = ({ route, onClick }) => {
  const iconPath = ROUTE_ICONS[route];
  const title = ROUTE_TITLES[route];

  return (
    <li>
      <a onClick={onClick} className="flex items-center gap-2">
        {iconPath && (
          <img 
            src={iconPath} 
            alt={title} 
            className="w-5 h-5"
          />
        )}
        {title}
      </a>
    </li>
  );
};

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
          <h1 className="text-2xl font-bold cursor-pointer text-center" onClick={() => navigate(ROUTES.HOME)}>
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
          <MenuItem route={ROUTES.STORE} onClick={() => navigate(ROUTES.STORE)} />
          <MenuItem route={ROUTES.INVENTORY} onClick={() => navigate(ROUTES.INVENTORY)} />
          <MenuItem route={ROUTES.BUD_BOX} onClick={() => navigate(ROUTES.BUD_BOX)} />
        </ul>
      </div>

      <div>
        <h2 className="font-bold text-lg mb-2">Combat</h2>
        <ul className="menu menu-lg bg-base-100 rounded-lg">
          <MenuItem route={ROUTES.LEVEL} onClick={() => navigate(ROUTES.LEVEL)} />
          <MenuItem route={ROUTES.ATTACK} onClick={() => navigate(ROUTES.ATTACK)} />
          <MenuItem route={ROUTES.DEFENSE} onClick={() => navigate(ROUTES.DEFENSE)} />
          <MenuItem route={ROUTES.HEALTH} onClick={() => navigate(ROUTES.HEALTH)} />
          <MenuItem route={ROUTES.EFFICIENCY} onClick={() => navigate(ROUTES.EFFICIENCY)} />
        </ul>
      </div>
      
      <div>
        <h2 className="font-bold text-lg mb-2">Passive</h2>
        <ul className="menu menu-lg bg-base-100 rounded-lg">
          <MenuItem route={ROUTES.FARMING} onClick={() => navigate(ROUTES.FARMING)} />
        </ul>
      </div>
      
      <div>
        <h2 className="font-bold text-lg mb-2">Non-Combat</h2>
        <ul className="menu menu-lg bg-base-100 rounded-lg">
          <MenuItem route={ROUTES.WOODCUTTING} onClick={() => navigate(ROUTES.WOODCUTTING)} />
          <MenuItem route={ROUTES.CRAFTING} onClick={() => navigate(ROUTES.CRAFTING)} />
          <MenuItem route={ROUTES.FISHING} onClick={() => navigate(ROUTES.FISHING)} />
          <MenuItem route={ROUTES.COOKING} onClick={() => navigate(ROUTES.COOKING)} />
          <MenuItem route={ROUTES.MINING} onClick={() => navigate(ROUTES.MINING)} />
          <MenuItem route={ROUTES.SMITHING} onClick={() => navigate(ROUTES.SMITHING)} />
        </ul>
      </div>
      
      <div>
        <h2 className="font-bold text-lg mb-2">Other</h2>
        <ul className="menu menu-lg bg-base-100 rounded-lg">
          <MenuItem route={ROUTES.COMPLETION_LOG} onClick={() => navigate(ROUTES.COMPLETION_LOG)} />
          <MenuItem route={ROUTES.LORE} onClick={() => navigate(ROUTES.LORE)} />
          <MenuItem route={ROUTES.STATISTICS} onClick={() => navigate(ROUTES.STATISTICS)} />
          <MenuItem route={ROUTES.SETTINGS} onClick={() => navigate(ROUTES.SETTINGS)} />
          <MenuItem route={ROUTES.NEWS} onClick={() => navigate(ROUTES.NEWS)} />
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
          <MenuItem route={ROUTES.BUG_REPORT} onClick={() => navigate(ROUTES.BUG_REPORT)} />
          <MenuItem route={ROUTES.PRIVACY} onClick={() => navigate(ROUTES.PRIVACY)} />
        </ul>
      </div>
      <p>Version 0</p>
    </div>
  );
};

export default Sidebar;