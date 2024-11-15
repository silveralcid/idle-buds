import NavbarDropdownOptions from "./NavbarDropdownOptions";

interface NavbarProps {
    drawerTitle?: string;
    onMenuClick?: () => void;
  }
  
  export const Navbar = ({ drawerTitle, onMenuClick }: NavbarProps) => {
    return (
      <div className="w-full navbar bg-base-300 h-20">
        <div className="flex-none lg:hidden">
          <label htmlFor="main-drawer" className="btn btn-square btn-ghost" onClick={onMenuClick}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
        </div>
        
        {/* Left side */}
        <div className="flex-1">

        </div>
  
        {/* Center */}
        <div className="flex-none">
        </div>
  
        {/* Right side */}
        <div className="flex-none">
          <NavbarDropdownOptions playerName="Silver" />
        </div>
      </div>
    );
  };