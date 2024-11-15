import NavbarDropdownOptions from "./NavbarDropdownOptions";
import NavbarDropdownEquipment from "./NavbarDropdownEquipment";
import NavbarLocationIndicator from "./NavbarLocationIndicator";

interface NavbarProps {
    drawerTitle?: string;
    onMenuClick?: () => void;
}

export const Navbar = ({ drawerTitle, onMenuClick }: NavbarProps) => {
    return (
        <div className="w-full flex flex-col h-20 fixed top-0 z-50">
            {/* Top Row */}
            <div className="flex w-full h-2/3 bg-base-300 shadow-lg">
                {/* Mobile Menu Toggle */}
                <div className="flex-none lg:hidden self-center">
                    <label 
                        htmlFor="main-drawer" 
                        className="btn btn-square btn-ghost" 
                        onClick={onMenuClick}
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
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </label>
                </div>
                
                {/* Left side */}
                <div className="flex-1 flex items-center">
                    <NavbarLocationIndicator pageTitle='Woodcutting' />
                </div>
    
                {/* Center */}
                <div className="flex-none flex items-center gap-4">
                    <NavbarDropdownEquipment />
                </div>
    
                {/* Right side */}
                <div className="flex-none flex items-center px-4">
                    <NavbarDropdownOptions playerName="Silver" />
                </div>
            </div>

            {/* Bottom Row */}
            <div className="flex w-full h-1/3 bg-base-200 shadow-md">
                {/* Mobile Menu Toggle (placeholder) */}
                <div className="flex-none lg:hidden self-center px-2">
                    {/* You can add a secondary menu or leave as placeholder */}
                </div>
                
                {/* Left side */}
                <div className="flex-1 flex items-center px-4">
                    {/* Additional navigation or information */}
                </div>
    
                {/* Center */}
                <div className="flex-none flex items-center gap-4">
                    {/* Additional buttons or navigation items */}
                </div>
    
                {/* Right side */}
                <div className="flex-none flex items-center px-4">
                    <p className="text-xs px-3">Last Cloud Save: 2h 42m 54s</p>
                    <button className="btn btn-primary btn-xs h-6 min-h-0">Force Save</button>
                </div>
            </div>
        </div>
    );
};