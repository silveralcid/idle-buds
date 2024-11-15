import { ReactNode } from 'react';
import { Navbar } from '../Navbar/Navbar';
import { useRouterStore } from '../../router/RouterStore';
import { ROUTE_TITLES } from '../../constants/routeMappings';

interface DrawerProps {
  children: ReactNode;
  sideContent: ReactNode;
}

export const DrawerLayout = ({ children, sideContent }: DrawerProps) => {
  const currentRoute = useRouterStore((state) => state.currentRoute);
  const drawerTitle = ROUTE_TITLES[currentRoute];

  console.log('DrawerLayout rendering, current route:', currentRoute);
  console.log('Drawer title:', drawerTitle);

  return (
    <div className="drawer lg:drawer-open">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        <Navbar drawerTitle={drawerTitle} />
        
        {/* Page Content */}
        <div className="mt-6">
          {children}
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="drawer-side z-[60]">
        <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu p-4 w-full lg:w-60 min-h-full bg-base-200 pt-0">
          {/* Header with Close Button - Mobile Only */}
          <div className="sticky top-0 bg-base-200 z-20 lg:hidden">
            <div className="flex justify-end px-2 py-2">
              <label 
                htmlFor="main-drawer" 
                className="btn btn-square btn-ghost btn-sm"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  className="inline-block w-5 h-5 stroke-current"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </label>
            </div>
          </div>
          
          {/* Sidebar content */}
          <div className="pt-2">
            {sideContent}
          </div>
        </div>
      </div>
    </div>
  );
};
