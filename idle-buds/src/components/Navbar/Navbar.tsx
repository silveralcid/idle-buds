import NavbarDropdownOptions from "./NavbarDropdownOptions";
import NavbarDropdownEquipment from "./NavbarDropdownEquipment";
import NavbarLocationIndicator from "./NavbarLocationIndicator";

interface NavbarProps {
    drawerTitle?: string;
    onMenuClick?: () => void;
}

export const Navbar = ({ drawerTitle, onMenuClick }: NavbarProps) => {
    return (
        <div className="fixed top-0 left-0 right-0 h-20 z-[51]">
            {/* Top Row */}
            <div className="w-full h-2/3 bg-base-300 shadow-lg">
                <div className="h-full flex items-center px-4 lg:pl-64">
                    {/* Left Column */}
                    <div className="flex items-center gap-2">
                        <div className="lg:hidden">
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
                        <NavbarLocationIndicator pageTitle='Woodcutting' />
                    </div>

                    {/* Right Column */}
                    <div className="ml-auto flex items-center gap-4">
                        <NavbarDropdownEquipment />
                        <NavbarDropdownOptions playerName="Silver" />
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="w-full h-1/3 bg-base-200 shadow-md">
                <div className="h-full flex items-center px-4 lg:pl-64">
                    {/* Left Column */}
                    <div className="flex items-center">
                        {/* Add any left-aligned content here */}
                    </div>

                    {/* Right Column */}
                    <div className="ml-auto flex items-center gap-4">
                        <p className="text-xs">Last Cloud Save: 2h 42m 54s</p>
                        <button className="btn btn-primary btn-xs h-6 min-h-0">Force Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};