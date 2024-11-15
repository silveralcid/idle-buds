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
        <div className="p-4">
          {children}
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 min-h-full bg-base-200">
          {sideContent}
        </div>
      </div>
    </div>
  );
};