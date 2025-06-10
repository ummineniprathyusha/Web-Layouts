// src/components/Layout.jsx
import React from 'react';
import MainNavbar from './MainNavbar';
import Navbar from './Navbar'; // Your existing secondary navbar
import Sidebar from './Sidebar';
import { useNavigation } from '../context/NavigationContext'; // Assuming you have this context

// --- Helper Component: MainContentArea ---
// This component will handle the dynamic width and scrolling for your primary content
const MainContentArea = ({ children, secondaryNavbar: SecondaryNavbarComponent }) => {
  const { isSidebarOpen } = useNavigation();
  const SIDEBAR_WIDTH = '16rem'; // This should match the 'min-w' of your Sidebar component
  const NAVBAR_HEIGHT = '4rem'; // Assuming MainNavbar is h-16 (16 * 0.25rem = 4rem)

  return (
    <div
      className={`
        flex flex-col flex-1 // Take available horizontal space, stack children vertically
        overflow-y-auto     // Key: Makes this area scrollable vertically
        h-[calc(100vh-${NAVBAR_HEIGHT})] // Key: Calculate height to fill remaining viewport
        transition-all duration-300 ease-in-out // Smooth transition for width change
      `}
      style={{
        // Dynamically set width based on sidebar state
        // When sidebar is open, width is 100% minus sidebar width
        // When sidebar is closed, width is 100%
        width: isSidebarOpen ? `calc(100% - ${SIDEBAR_WIDTH})` : '100%',
      }}
    >
      {/* Optional: Secondary Navbar (if it should scroll with content) */}
      {SecondaryNavbarComponent && (
        <div className="p-4 bg-white shadow-sm"> {/* Adjust padding/styling as needed */}
          <SecondaryNavbarComponent />
        </div>
      )}

      {/* Main content area where your pages (children) will be rendered */}
      <main className="flex-1 p-5"> {/* flex-1 allows content to take remaining height, p-5 for padding */}
        {children}
      </main>
    </div>
  );
};
// --- End Helper Component ---

export function Layout({ children }) {
  // We only need the isSidebarOpen state to control the Sidebar's visibility
  // The MainContentArea handles its own width based on isSidebarOpen
  const { isSidebarOpen } = useNavigation();

  return (
    // Outer container: Fills entire viewport, ensures no main body scroll
    <div className="flex flex-col h-screen overflow-hidden">
      {/* 1. Fixed MainNavbar at the very top */}
      <MainNavbar /> {/* Assume MainNavbar has fixed, top-0, h-16, z-50 etc. */}

      {/* 2. Content below MainNavbar: Sidebar and MainContentArea */}
      <div
        className="flex flex-1" // Takes remaining vertical space, lays out children horizontally
        style={{ marginTop: '4rem' }} // Push this section down by MainNavbar's height (h-16 = 4rem)
      >
        {/* 3. Sidebar: Fixed to the left, manages its own visibility/width */}
        {/* Its presence simply shifts the MainContentArea using its fixed width */}
        <Sidebar /> {/* Assume Sidebar handles its own fixed, left-0, h-screen, z-50 etc. */}

        {/* 4. Main content area: This is the scrollable, dynamic-width section */}
        <MainContentArea secondaryNavbar={Navbar}> {/* Pass your existing Navbar component */}
          {children} {/* This will be your AllPagesView or other routes */}
        </MainContentArea>
      </div>
    </div>
  );
}

export default Layout;