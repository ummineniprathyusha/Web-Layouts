// import React, { createContext, useState, useContext, useEffect } from 'react';

// const NavigationContext = createContext();

// export const NavigationProvider = ({ children }) => {
//   const [navItems, setNavItems] = useState(() => {
//     const saved = localStorage.getItem('navItems');
//     return saved ? JSON.parse(saved) : [
//       { 
//         id: 1, 
//         title: 'Home', 
//         slug: 'home',
//         content: {
//           title: 'Welcome to the Home Page',
//           description: 'This is the dynamically loaded Home page content.'
//         }
//       },
//       { 
//         id: 2, 
//         title: 'About', 
//         slug: 'about',
//         content: {
//           title: 'About Us',
//           description: 'Learn more about us on this dynamic About page.'
//         }
//       },
//       { 
//         id: 3, 
//         title: 'Services', 
//         slug: 'services',
//         content: {
//           title: 'Our Services',
//           description: 'These are the services we dynamically offer.'
//         }
//       },
//       { 
//         id: 4, 
//         title: 'Contact', 
//         slug: 'contact',
//         content: {
//           title: 'Get in Touch',
//           description: 'Reach out to us through this dynamic contact page.'
//         }
//       }
//     ];
//   });

//   useEffect(() => {
//     localStorage.setItem('navItems', JSON.stringify(navItems));
//   }, [navItems]);

//   const addItem = (title) => {
//     const slug = title.toLowerCase().replace(/\s+/g, '-');
//     const newItem = {
//       id: Date.now(),
//       title,
//       slug,
//       content: {
//         title: `${title} Page`,
//         description: `This is the content for ${title} page`
//       }
//     };
//     setNavItems([...navItems, newItem]);
//     return newItem;
//   };

//   const updateItem = (id, newTitle) => {
//     setNavItems(navItems.map(item => 
//       item.id === id ? { 
//         ...item, 
//         title: newTitle.trim(),
//         slug: newTitle.toLowerCase().replace(/\s+/g, '-')
//       } : item
//     ));
//   };

//   const updateContent = (id, newContent) => {
//     setNavItems(navItems.map(item => 
//       item.id === id ? { ...item, content: newContent } : item
//     ));
//   };

//   const deleteItem = (id) => {
//     setNavItems(navItems.filter(item => item.id !== id));
//   };

//   return (
//     <NavigationContext.Provider
//       value={{ navItems, addItem, updateItem, updateContent, deleteItem }}
//     >
//       {children}
//     </NavigationContext.Provider>
//   );
// };

// export const useNavigation = () => {
//   const context = useContext(NavigationContext);
//   if (!context) {
//     throw new Error('useNavigation must be used within a NavigationProvider');
//   }
//   return context;
// };

// export default NavigationContext;















// import React, { createContext, useState, useContext, useEffect } from 'react';

// const NavigationContext = createContext();

// export const NavigationProvider = ({ children }) => {
//   // navItems state (your existing code)
//   const [navItems, setNavItems] = useState(() => {
//     const saved = localStorage.getItem('navItems');
//     return saved ? JSON.parse(saved) : [
//       { 
//         id: 1, 
//         title: 'Home', 
//         slug: 'home',
//         content: {
//           title: 'Welcome to the Home Page',
//           description: 'This is the dynamically loaded Home page content.'
//         }
//       },
//       { 
//         id: 2, 
//         title: 'About', 
//         slug: 'about',
//         content: {
//           title: 'About Us',
//           description: 'Learn more about us on this dynamic About page.'
//         }
//       },
//       { 
//         id: 3, 
//         title: 'Services', 
//         slug: 'services',
//         content: {
//           title: 'Our Services',
//           description: 'These are the services we dynamically offer.'
//         }
//       },
//       { 
//         id: 4, 
//         title: 'Contact', 
//         slug: 'contact',
//         content: {
//           title: 'Get in Touch',
//           description: 'Reach out to us through this dynamic contact page.'
//         }
//       }
//     ];
//   });

//   // NEW: logo state with localStorage persistence
//   const [logo, setLogo] = useState(() => {
//     const saved = localStorage.getItem('logo');
//     return saved ? JSON.parse(saved) : { text: 'MyBrand', image: '' };
//   });

//   useEffect(() => {
//     localStorage.setItem('navItems', JSON.stringify(navItems));
//   }, [navItems]);

//   useEffect(() => {
//     localStorage.setItem('logo', JSON.stringify(logo));
//   }, [logo]);

//   // Existing functions (addItem, updateItem, updateContent, deleteItem)...

//   // NEW: update logo (text or image)
//   const updateLogo = (newLogo) => {
//     setLogo(prev => ({ ...prev, ...newLogo }));
//   };

//   return (
//     <NavigationContext.Provider
//       value={{
//         navItems, addItem, updateItem, updateContent, deleteItem,
//         logo, updateLogo // expose logo and updateLogo
//       }}
//     >
//       {children}
//     </NavigationContext.Provider>
//   );
// };

// export const useNavigation = () => {
//   const context = useContext(NavigationContext);
//   if (!context) {
//     throw new Error('useNavigation must be used within a NavigationProvider');
//   }
//   return context;
// };

// export default NavigationContext;












// import React, { createContext, useState, useContext, useEffect } from 'react';

// const NavigationContext = createContext();

// export const NavigationProvider = ({ children }) => {
//   // Navigation items state - initialized from localStorage or empty
//   const [navItems, setNavItems] = useState(() => {
//     const saved = localStorage.getItem('navItems');
//     return saved ? JSON.parse(saved) : [];
//   });

//   // Logo state
//   const [logo, setLogo] = useState(() => {
//     const savedLogo = localStorage.getItem('logo');
//     return savedLogo ? JSON.parse(savedLogo) : { image: '/default-logo.png', alt: 'Logo' };
//   });

//   // Track currently active page for scroll-to behavior
//   const [activePageId, setActivePageId] = useState(null);

//   // Sync navItems to localStorage
//   useEffect(() => {
//     localStorage.setItem('navItems', JSON.stringify(navItems));
//   }, [navItems]);

//   // Sync logo to localStorage
//   useEffect(() => {
//     localStorage.setItem('logo', JSON.stringify(logo));
//   }, [logo]);

//   // Add a new page
//   const addItem = (title) => {
//     const slug = title.toLowerCase().replace(/\s+/g, '-');
//     const newItem = {
//       id: Date.now(),
//       title,
//       slug,
//       content: {
//         title: `${title} Page`,
//         description: `This is the content for ${title} page.`,
//       },
//     };
//     setNavItems((prev) => [...prev, newItem]);
//     return newItem;
//   };

//   // Update title and slug of a page
//   const updateItem = (id, newTitle) => {
//     setNavItems((prev) =>
//       prev.map((item) =>
//         item.id === id
//           ? {
//               ...item,
//               title: newTitle.trim(),
//               slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
//             }
//           : item
//       )
//     );
//   };

//   // Update content of a page
//   const updateContent = (id, newContent) => {
//     setNavItems((prev) =>
//       prev.map((item) => (item.id === id ? { ...item, content: newContent } : item))
//     );
//   };

//   // Delete a page
//   const deleteItem = (id) => {
//     setNavItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   // Update logo (text or image)
//   const updateLogo = (newLogo) => {
//     setLogo((prev) => ({ ...prev, ...newLogo }));
//   };

//   return (
//     <NavigationContext.Provider
//       value={{
//         navItems,
//         addItem,
//         updateItem,
//         updateContent,
//         deleteItem,
//         logo,
//         updateLogo,
//         activePageId,
//         setActivePageId,
//       }}
//     >
//       {children}
//     </NavigationContext.Provider>
//   );
// };

// // Hook to use the context
// export const useNavigation = () => {
//   const context = useContext(NavigationContext);
//   if (!context) {
//     throw new Error('useNavigation must be used within a NavigationProvider');
//   }
//   return context;
// };

// export default NavigationContext;








import React, { createContext, useState, useContext, useEffect } from 'react';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [navItems, setNavItems] = useState(() => {
    const saved = localStorage.getItem('navItems');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Home', slug: 'home', content: { title: 'Home Page', description: 'Welcome!' } },
      { id: 2, title: 'About', slug: 'about', content: { title: 'About Us', description: 'Info here' } }
    ];
  });

  const [logo, setLogo] = useState(() => {
    const savedLogo = localStorage.getItem('logo');
    return savedLogo ? JSON.parse(savedLogo) : { image: '/default-logo.png', alt: 'Logo' };
  });

  const [activePageId, setActivePageId] = useState(navItems[0]?.id || null);

  const [selectedLayouts, setSelectedLayouts] = useState(() => {
    const saved = localStorage.getItem('selectedLayouts');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('navItems', JSON.stringify(navItems));
  }, [navItems]);

  useEffect(() => {
    localStorage.setItem('logo', JSON.stringify(logo));
  }, [logo]);

  useEffect(() => {
    localStorage.setItem('selectedLayouts', JSON.stringify(selectedLayouts));
  }, [selectedLayouts]);

  const addItem = (title) => {
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const exists = navItems.find((item) => item.slug === slug);
  if (exists) return exists;
    const newItem = {
      id: Date.now(),
      title,
      slug,
      content: { title: `${title} Page`, description: `This is the content for ${title} page.` },
    };
    setNavItems((prev) => [...prev, newItem]);
    return newItem;
  };

  const updateItem = (id, newTitle) => {
    setNavItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              title: newTitle.trim(),
              slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
            }
          : item
      )
    );
  };

  const updateContent = (id, newContent) => {
    setNavItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, content: newContent } : item))
    );
  };

  const deleteItem = (id) => {
    setNavItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateLogo = (newLogo) => {
    setLogo((prev) => ({ ...prev, ...newLogo }));
  };

  const setLayoutForPage = (pageId, layoutKey) => {
    setSelectedLayouts((prev) => ({ ...prev, [pageId]: layoutKey }));
  };

  return (
    <NavigationContext.Provider
      value={{
        navItems,
        addItem,
        updateItem,
        updateContent,
        deleteItem,
        logo,
        updateLogo,
        activePageId,
        setActivePageId,
        selectedLayouts,
        setLayoutForPage,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within NavigationProvider');
  return context;
};
