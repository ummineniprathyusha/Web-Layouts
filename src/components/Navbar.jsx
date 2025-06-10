// // src/components/Navbar.jsx
// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Menu } from 'lucide-react';

// const navLinks = [
//   'Home',
//   'About',
//   'Services',
//   'Testimonials',
//   'Contact',
// ];

// function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const leftLinks = navLinks.slice(0, 3);
//   const rightLinks = navLinks.slice(3);

//   const NavGroup = ({ links, isMobile = false }) => (
//     <div className={`flex ${isMobile ? 'flex-col gap-2' : 'gap-4'} ${isMobile ? '' : 'items-center'}`}>
//       {links.map((name) => {
//         const path = name === 'Home' ? '/' : `/${name.toLowerCase()}`;
//         const isActive = location.pathname === path;

//         return (
//           <button
//             key={name}
//             onClick={() => {
//               navigate(path);
//               setMenuOpen(false);
//             }}
//             className={`transition text-left ${
//               isActive
//                 ? 'text-white-600 font-semibold '
//                 : 'text-white '
//             }`}
//           >
//             {name}
//           </button>
//         );
//       })}
//     </div>
//   );

//   return (
//     <header className="  items-center justify-center  py-4 text-white bg-transparent w-full fixed z-1">
//       <div className="flex justify-between items-center">
//         {/* Mobile logo */}
//         <div className="text-2xl font-bold sm:hidden">Job Portal</div>

//         {/* Hamburger menu button */}
//         <button className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
//           <Menu className="w-6 h-6" />
//         </button>

//         {/* Desktop nav */}
//         <div className="hidden sm:flex w-full justify-center items-center gap-12">
//           <NavGroup links={leftLinks} />
//           <div className="text-2xl font-bold">job portal</div>
//           <NavGroup links={rightLinks} />
//         </div>
//       </div>

//       {/* Mobile dropdown */}
//       {menuOpen && (
//         <div className="sm:hidden mt-4 flex flex-col gap-2 pl-2">
//           <NavGroup links={leftLinks} isMobile />
//           <NavGroup links={rightLinks} isMobile />
//         </div>
//       )}
//     </header>
//   );
// }

// export default Navbar;












// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Menu } from 'lucide-react';
// import { useNavigation } from '../context/NavigationContext';

// function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const { navItems } = useNavigation();

//   const NavGroup = ({ links, isMobile = false }) => (
//     <div className={`flex ${isMobile ? 'flex-col gap-3' : 'gap-6'} ${isMobile ? '' : 'items-center'}`}>
//       {links.map((item) => {
//         const path = item.slug === 'home' ? '/' : `/${item.slug}`;
//         const isActive = location.pathname === path;

//         return (
//           <button
//             key={item.id}
//             onClick={() => {
//               navigate(path);
//               setMenuOpen(false);
//             }}
//             className={`transition text-left ${isActive ? 'text-white font-semibold' : 'text-white'
//               }`}
//           >
//             {item.title}
//           </button>
//         );
//       })}
//     </div>
//   );

//   return (
//     <header className="bg-blue-300 fixed w-full z-10 py-4 text-white">
//       <div className="flex items-center justify-between px-4 sm:px-8">

//         <img
//           src={logo.image}
//           alt="Logo"
//           className="h-8 cursor-pointer"
//           onClick={() => navigate('/')}
//         />



//         <nav className="hidden sm:flex items-center gap-8 flex-1 justify-center">
//           <NavGroup links={navItems} />
//         </nav>



//         {/* Mobile hamburger menu */}
//         <button
//           className="sm:hidden"
//           onClick={() => setMenuOpen(!menuOpen)}
//           aria-label="Toggle menu"
//         >
//           <Menu className="w-6 h-6" />
//         </button>
//       </div>

//       {/* Mobile dropdown */}
//       {menuOpen && (
//         <div className="sm:hidden mt-4 flex flex-col gap-3 px-4 bg-blue-300">
//           <NavGroup links={navItems} isMobile />
//         </div>
//       )}
//     </header>

//   );
// }

// export default Navbar;











import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

function Navbar() {
  const navigate = useNavigate();  
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { navItems, logo, setActivePageId } = useNavigation();

  const handleNavClick = async (itemId) => {
    const isOnAllPage = location.pathname === '/' || location.pathname === '/all';

    if (!isOnAllPage) {
      // Navigate first, then scroll after render
      navigate('/');
      setTimeout(() => setActivePageId(itemId), 100); // Slight delay allows scroll refs to mount
    } else {
      setActivePageId(itemId);
    }

    setMenuOpen(false);
  };

  const NavGroup = ({ links, isMobile = false }) => (
    <div className={`flex ${isMobile ? 'flex-col gap-3' : 'gap-6'} ${isMobile ? '' : 'items-center'}`}>
      {links.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavClick(item.id)}
          className="transition text-left text-white hover:font-semibold"
        >
          {item.title}
        </button>
      ))}
    </div>
  );

  return (
    <header className="bg-bg-dark top-13 fixed w-full z-10 py-4 text-white">
      <div className="flex items-center justify-between px-4 ">
        {/* Logo */}
        <div
          className="cursor-pointer flex items-center"
          onClick={() => navigate('/')}
          aria-label="Go to Home"
        >
          {logo.image ? (
            <img src={logo.image} alt="Logo" className="h-10   " />
          ) : (
            <span className="text-xl font-bold">{logo.text || 'Logo'}</span>
          )}
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-8 flex-1 justify-center">
          <NavGroup links={navItems} />
        </nav>

        {/* Mobile hamburger menu */}
        <button
          className="sm:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden mt-4 flex flex-col gap-3 px-4 bg-bg-dark  ">
          <NavGroup links={navItems} isMobile  />
        </div>
      )}
    </header>
  );
}

export default Navbar;
