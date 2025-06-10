// 'use client';

// import React from 'react';
// import { Menu } from 'lucide-react';

// export function MainNavbar({ onToggleSidebar }) {
//   return (
//    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white flex items-center px-4 py-3 justify-between">


//       {/* Left side: hamburger menu + title */}
//       <div className="flex items-center space-x-4">
//         <button
//           onClick={onToggleSidebar}
//           className="focus:outline-none"
//           aria-label="Toggle sidebar"
//         >
//           <Menu className="w-6 h-6" />
//         </button>
//         <span className="text-xl font-bold select-none">HUB portal</span>
//       </div>

//       {/* Right side: nav buttons */}
//       <nav className="space-x-6 hidden sm:flex">
//         <button className="hover:underline">Pages</button>
//         <button className="hover:underline">Design</button>
//         <button className="hover:underline">Settings</button>
//         <button className="hover:underline">Domain</button>
//       </nav>
//     </header>
//   );
// }

// export default MainNavbar;







'use client';

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';

const navItems = [
  {
    name: 'Pages',
    to: '/pages',
    submenu: ['Page 1', 'Page 2', 'Page 3', 'Page 4'],
  },
  {
    name: 'Design',
    to: '/design',
    submenu: ['Design 1', 'Design 2', 'Design 3', 'Design 4'],
  },
  {
    name: 'Settings',
    to: '/settings',
    submenu: ['Setting 1', 'Setting 2', 'Setting 3', 'Setting 4'],
  },
  {
    name: 'Domain',
    to: '/domain',
    submenu: ['Domain 1', 'Domain 2', 'Domain 3', 'Domain 4'],
  },
];

export function MainNavbar({ onToggleSidebar }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (onToggleSidebar) onToggleSidebar();
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const toggleMobileSubmenu = (name) => {
    setMobileSubmenuOpen(mobileSubmenuOpen === name ? null : name);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white flex items-center px-4 py-3 shadow">
        {/* Left: sidebar hamburger + title */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <button
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            className="focus:outline-none"
          >
            {sidebarOpen ? <ChevronRight className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="text-xl font-bold select-none">LOGO</span>
        </div>

        {/* Center: desktop nav links */}
        <nav className="hidden sm:flex space-x-6 flex-grow justify-center">
          {navItems.map(({ name, to, submenu }) => (
            <div key={name} className="relative group">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `hover:underline ${isActive ? 'underline font-bold' : ''}`
                }
              >
                {name}
              </NavLink>

              {/* Dropdown - show on hover (desktop) */}
              <div className="absolute left-0 top-full mt-2 bg-gray-900 text-white  shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50 min-w-[150px]">
                {submenu.map((item) => (
                  <NavLink
                    key={item}
                    to={`${to}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    {item}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Right: mobile menu hamburger */}
        <div className="sm:hidden flex-shrink-0">
          <button
            onClick={toggleMobileMenu}
            className="focus:outline-none"
            aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <nav className="fixed top-12 right-0 left-0 bg-gray-900 text-white flex flex-col space-y-1 p-4 sm:hidden z-40 shadow-lg">
          {navItems.map(({ name, to, submenu }) => (
            <div key={name} className="border-b border-gray-700">
              <button
                className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-gray-700"
                onClick={() => toggleMobileSubmenu(name)}
                aria-expanded={mobileSubmenuOpen === name}
              >
                <span>{name}</span>
                <ChevronRight
                  className={`w-5 h-5 transform transition-transform duration-300 ${
                    mobileSubmenuOpen === name ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {/* Mobile submenu */}
              {mobileSubmenuOpen === name && (
                <div className="pl-6 flex flex-col bg-gray-800">
                  {submenu.map((item) => (
                    <NavLink
                      key={item}
                      to={`${to}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="py-2 px-4 hover:bg-gray-700"
                      onClick={() => setMobileMenuOpen(false)} // close menu on click
                    >
                      {item}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </>
  );
}

export default MainNavbar;
