import React from 'react';

interface NavbarDropdownOptionsProps {
  playerName: string;
}

const NavbarDropdownOptions: React.FC<NavbarDropdownOptionsProps> = ({ playerName }) => {
  return (
    <div className="dropdown dropdown-end dropdown-bottom">
      <div tabIndex={0} role="button" className="btn btn-outline">
        {playerName}
      </div>
      <ul 
        tabIndex={0} 
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-64"
      >
        {/* Account Section */}
        <li className="menu-title">
          <span>Account</span>
        </li>
        <li>
          <a>Logged in as: {playerName}</a>
        </li>
        <li>
          <a>Change Password</a>
        </li>
        <li>
          <a>Logout</a>
        </li>

        <div className="divider my-1"></div>

        {/* Save Management Section */}
        <li className="menu-title">
          <span>Save Management</span>
        </li>
        <li>
          <a>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Create Shareable Save URL
          </a>
        </li>
        <li>
          <a>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Save
          </a>
        </li>
        <li>
          <a>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Save
          </a>
        </li>

        <div className="divider my-1"></div>

        {/* Actions Section */}
        <li className="menu-title">
          <span>Actions</span>
        </li>
        <li>
          <a>Change Character Name</a>
        </li>
        <li>
          <a>Select Character</a>
        </li>
      </ul>
    </div>
  );
};

export default NavbarDropdownOptions;