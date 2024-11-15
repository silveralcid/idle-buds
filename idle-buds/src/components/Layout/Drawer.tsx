import { ReactNode } from 'react';
import { Navbar } from '../Navbar/Navbar';

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
        <Navbar drawerTitle={drawerTitle} />
        
        {/* Page Content */}
        <div className="p-4 mt-20">
          {children}
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="drawer-side z-[60]">
        <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu p-4 w-full lg:w-60 min-h-full bg-base-200 pt-0">
          {/* Header Section */}
          <div className="sticky top-0 bg-base-200 z-20">
            {/* Top Bar */}
            <div className="flex flex-col lg:hidden">
              {/* Title Bar with Close Button */}
              <div className="h-[3.25rem] bg-base-300 flex justify-between items-center px-4">
                <span className="text-xl font-bold">Idle Buds</span>
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
              
              {/* Subtitle/Location Bar */}
              <div className="h-[1.75rem] bg-base-200 flex items-center px-4">
                <span className="text-sm text-base-content/60">{drawerTitle}</span>
              </div>
            </div>
          </div>
          
          {/* Sidebar content */}
          <div className="pt-4">
            {sideContent}
          </div>
        </div>
      </div>
    </div>
  );
};