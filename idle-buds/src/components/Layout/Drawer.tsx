import { ReactNode } from 'react';

interface DrawerProps {
  children: ReactNode;
  sideContent: ReactNode;
  drawerTitle?: string;
}

export const DrawerLayout = ({ children, sideContent, drawerTitle }: DrawerProps) => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        
        {/* Page Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu p-4 w-full lg:w-60 min-h-full bg-base-200">
          {/* Close button */}
          <div className="flex justify-between items-center lg:hidden mb-4">
            <span className="text-xl font-bold">{drawerTitle}</span>
            <label 
              htmlFor="main-drawer" 
              className="btn btn-square btn-ghost"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                className="inline-block w-6 h-6 stroke-current"
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
          
          {/* Sidebar content */}
          {sideContent}
        </div>
      </div>
    </div>
  );
};