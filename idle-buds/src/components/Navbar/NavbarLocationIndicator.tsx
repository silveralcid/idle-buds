import { FC } from 'react';
import { useRouterStore } from '../../router/RouterStore';
import { ROUTE_ICONS, ROUTE_TITLES } from '../../constants/routeMappings';

export const NavbarLocationIndicator: FC = () => {
    const currentPath = useRouterStore((state) => state.currentRoute);
    const pageTitle = ROUTE_TITLES[currentPath] || 'Page Not Found';
    const iconPath = ROUTE_ICONS[currentPath];

    return (
        <div className="flex items-center gap-3">
            {/* Column 1: Square Icon */}
            <div className="w-12 h-12 bg-base-300 rounded-lg flex items-center justify-center">
                {iconPath ? (
                    <img 
                        src={iconPath} 
                        alt={pageTitle}
                        className="w-6 h-6 stroke-current"
                    />
                ) : (
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
