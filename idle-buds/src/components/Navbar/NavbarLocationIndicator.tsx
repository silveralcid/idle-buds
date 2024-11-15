import { FC } from 'react';
import { useLocation } from 'react-router-dom';

// Icon mapping object
const ROUTE_ICONS: Record<string, JSX.Element> = {
  '/woodcutting': (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  '/crafting': (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  '/fishing': (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  // Add more icons for other routes as needed
};

// Title mapping object
const ROUTE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/store': 'Store',
  '/inventory': 'Inventory',
  '/bud-box': 'Bud Box',
  '/level': 'Level',
  '/attack': 'Attack',
  '/defense': 'Defense',
  '/health': 'Health',
  '/efficiency': 'Efficiency',
  '/farming': 'Farming',
  '/woodcutting': 'Woodcutting',
  '/crafting': 'Crafting',
  '/fishing': 'Fishing',
  '/cooking': 'Cooking',
  '/mining': 'Mining',
  '/smithing': 'Smithing',
  '/completion-log': 'Completion Log',
  '/lore': 'Lore',
  '/statistics': 'Statistics',
  '/settings': 'Settings',
  '/news': 'News & Changelog',
  '/bug-report': 'Report a Bug',
  '/privacy': 'Privacy Policy',
};

export const NavbarLocationIndicator: FC = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const pageTitle = ROUTE_TITLES[currentPath] || 'Page Not Found';

    return (
        <div className="flex items-center gap-3">
            {/* Column 1: Square Icon */}
            <div className="w-12 h-12 bg-base-300 rounded-lg flex items-center justify-center">
                {ROUTE_ICONS[currentPath] || (
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        className="w-6 h-6 stroke-current"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                )}
            </div>

            {/* Column 2: Title and Subtitle */}
            <div className="flex flex-col">
                {/* Row 1: Page Title */}
                <h1 className="text-xl font-bold leading-tight">
                    {pageTitle}
                </h1>
                
                {/* Row 2: Icon and Text */}
                <div className="flex items-center gap-1 text-base-content/70">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        className="w-4 h-4 stroke-current"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                    </svg>
                    <span className="text-sm">Game Guide</span>
                </div>
            </div>
        </div>
    );
};

export default NavbarLocationIndicator;