// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { FaPlus, FaFileAlt, FaEdit, FaThLarge, FaCog } from 'react-icons/fa';
// import { useNavigation } from '../context/NavigationContext';

// // Import your external layouts here (replace with your actual imports)
// import { GridLayout, ListLayout, CardLayout } from '../layouts';

// // Define LayoutComponents mapping so it’s defined and usable in renderLayoutPicker
// const LayoutComponents = {
//   grid: GridLayout,
//   list: ListLayout,
//   card: CardLayout,
// };

// function Sidebar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const {
//     navItems,
//     addItem,
//     updateItem,
//     deleteItem,
//     logo,
//     updateLogo,
//     setActivePageId,
//   } = useNavigation();

//   const [logoText, setLogoText] = useState(logo.text);
//   const [logoImage, setLogoImage] = useState(logo.image);
//   const [tempLogoText, setTempLogoText] = useState(logo.text);
//   const [tempLogoImage, setTempLogoImage] = useState(logo.image);
//   const [showLogoEdit, setShowLogoEdit] = useState(false);
//   const [newLink, setNewLink] = useState('');
//   const [showAddInput, setShowAddInput] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [editingText, setEditingText] = useState('');

//   // Track which nav item has layout picker open
//   const [layoutPickerOpenId, setLayoutPickerOpenId] = useState(null);

//   // Track selected layouts per nav item (store component key or id)
//   const [selectedLayouts, setSelectedLayouts] = useState({});

//   const handleLogoImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setTempLogoImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const saveLogoChanges = () => {
//     updateLogo({ text: tempLogoText, image: tempLogoImage });
//     setLogoText(tempLogoText);
//     setLogoImage(tempLogoImage);
//     setShowLogoEdit(false);
//   };

//   const cancelLogoChanges = () => {
//     setTempLogoText(logoText);
//     setTempLogoImage(logoImage);
//     setShowLogoEdit(false);
//   };

//   const handleNavClick = (item) => {
//     const path = item.slug === 'home' ? '/' : `/${item.slug}`;
//     const isOnAllPage = location.pathname === '/' || location.pathname === '/all';

//     if (isOnAllPage) {
//       setActivePageId(item.id);
//     } else {
//       navigate('/');
//       setTimeout(() => {
//         setActivePageId(item.id);
//       }, 100);
//     }
//   };

//   // Render layout picker for a nav item
//   const renderLayoutPicker = (item) => {
//     return (
//       <div
//         className="bg-gray-800 p-2 mt-1  max-h-full space-y-2"
//         style={{
//           overflowY: 'auto',
//           scrollbarWidth: 'none',    // Firefox
//           msOverflowStyle: 'none'    // IE 10+
//         }}
//       >
//         {Object.entries(LayoutComponents).map(([key, LayoutComp]) => {
//           const isSelected = selectedLayouts[item.id] === key;

//           return (
//             <button
//               key={key}
//               onClick={() => {
//                 setSelectedLayouts((prev) => ({ ...prev, [item.id]: key }));
//                 setLayoutPickerOpenId(null);
//                 console.log(`Selected layout '${key}' for page ${item.title}`);
//               }}
//               className={`w-full  border-2 ${isSelected ? 'border-cyan-500' : 'border-transparent'
//                 } focus:outline-none`}
//               title={`Select ${key} layout`}
//             >
//               <LayoutComp />
//             </button>
//           );
//         })}
//       </div>
//     );
//   };


//   return (
//     <aside className="min-w-[16rem] max-w-[30rem] bg-gray-700 p-4 min-h-screen text-text mt-13">

//       {/* LOGO EDIT SECTION */}
//       <section className="mb-6">
//         {showLogoEdit ? (
//           <>
//             <input
//               type="text"
//               value={tempLogoText}
//               onChange={(e) => setTempLogoText(e.target.value)}
//               className="w-full px-3 py-1 mb-3 text-text border border-black"
//               placeholder="Enter logo text"
//             />

//             {tempLogoImage ? (
//               <div className="flex items-center gap-3 mb-2">
//                 <img
//                   src={tempLogoImage}
//                   alt="Logo Preview"
//                   className="h-16 object-contain"
//                 />
//               </div>
//             ) : (
//               <p className="mb-2 text-text">Select LOGO</p>
//             )}
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleLogoImageChange}
//               className="mb-4 border border-black p-1"
//             />

//             <div className="flex gap-2">
//               <button
//                 onClick={saveLogoChanges}
//                 className="flex-1 bg-gray-600 text-text px-3 py-1"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={cancelLogoChanges}
//                 className="flex-1 bg-gray-400 text-text px-3 py-1"
//               >
//                 Cancel
//               </button>
//             </div>
//           </>
//         ) : (
//           <button
//             onClick={() => setShowLogoEdit(true)}
//             className="w-full bg-gray-600 text-text px-3 py-2 flex items-center justify-between"
//           >
//             <span>Edit Logo</span>
//             <FaPlus />
//           </button>
//         )}
//       </section>

//       {/* ADD NEW PAGE SECTION */}
//       <div className="mb-6">
//         {showAddInput ? (
//           <>
//             <input
//               type="text"
//               placeholder="New link name"
//               value={newLink}
//               onChange={(e) => setNewLink(e.target.value)}
//               className="w-full px-3 py-1 border mb-2 text-text"
//             />
//             <div className="flex gap-2">
//               <button
//                 onClick={() => {
//                   if (newLink.trim() !== '') {
//                     addItem(newLink);
//                     setNewLink('');
//                     setShowAddInput(false);
//                   }
//                 }}
//                 className="flex-1 bg-gray-600 text-text px-3 py-1"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => {
//                   setNewLink('');
//                   setShowAddInput(false);
//                 }}
//                 className="flex-1 bg-gray-400 text-text px-3 py-1"
//               >
//                 Cancel
//               </button>
//             </div>
//           </>
//         ) : (
//           <button
//             onClick={() => setShowAddInput(true)}
//             className="w-full bg-gray-600 text-text px-3 py-2 flex items-center justify-between"
//           >
//             <span>Add New Page</span>
//             <FaPlus />
//           </button>
//         )}
//       </div>

//       {/* NAV ITEMS LIST */}
//       <ul className="space-y-2">
//         {navItems.map((item) => {
//           const path = `/${item.slug}`;
//           const isActive =
//             location.pathname === path ||
//             (item.slug === 'home' && location.pathname === '/');

//           return (
//             <li key={item.id} className="flex flex-col bg-black px-2 ">
//               {editingId === item.id ? (
//                 <div className="flex w-full">
//                   <input
//                     value={editingText}
//                     onChange={(e) => setEditingText(e.target.value)}
//                     className="w-full px-2 py-1 border text-text"
//                   />
//                   <button
//                     onClick={() => {
//                       if (editingText.trim() !== '') {
//                         updateItem(item.id, editingText);
//                         setEditingId(null);
//                         setEditingText('');
//                       }
//                     }}
//                     className="ml-2 px-2 py-1 bg-cyan-700 text-text"
//                   >
//                     Save
//                   </button>
//                 </div>
//               ) : (
//                 <>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => handleNavClick(item)}
//                       className={`flex-1 flex items-center gap-2 text-left px-4 py-2 transition ${isActive ? 'bg-gray-500 text-text' : 'hover:bg-gray-700 text-text'
//                         }`}
//                     >
//                       <FaFileAlt />
//                       {item.title}
//                     </button>

//                     <div className="flex gap-2">
//                       {/* Edit button */}
//                       <button
//                         onClick={() => {
//                           setEditingId(item.id);
//                           setEditingText(item.title);
//                         }}
//                         className="text-text"
//                         title="Edit"
//                       >
//                         <FaEdit />
//                       </button>

//                       {/* Layout button */}
//                       <button
//                         onClick={() => {
//                           setLayoutPickerOpenId(layoutPickerOpenId === item.id ? null : item.id);
//                         }}
//                         className="text-text"
//                         title="Layout"
//                       >
//                         <FaThLarge />
//                       </button>

//                       {/* Settings button */}
//                       <button
//                         onClick={() => {
//                           console.log(`Settings clicked for ${item.title}`);
//                         }}
//                         className="text-text"
//                         title="Settings"
//                       >
//                         <FaCog />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Layout picker panel */}
//                   {layoutPickerOpenId === item.id && renderLayoutPicker(item)}
//                 </>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     </aside>
//   );
// }

// export default Sidebar;


// import React, { useState, useEffect, useRef, Suspense } from 'react'; // Added Suspense, useEffect, useRef
// import { useNavigate, useLocation } from 'react-router-dom';
// import { FaPlus, FaEdit, FaThLarge, FaCog } from 'react-icons/fa';
// import { useNavigation } from '../context/NavigationContext';

// // --- Import your actual Layout Components ---
// // Ensure these imports are correct based on your file structure.
// // If you are using React.lazy for dynamic imports, ensure that's configured.
// import {
//   GridLayout,
//   ListLayout,
//   TestimonialLayout,
//   HeroLayout,
//   MissionVisionLayout,
//   TeamLayout,
//   CtaLayout
// } from '../layouts';

// const LayoutComponents = {
//   grid: GridLayout,
//   list: ListLayout,
//   testimonial: TestimonialLayout,
//   hero: HeroLayout,
//   missionVision: MissionVisionLayout,
//   team: TeamLayout,
//   cta: CtaLayout,
// };
// // --- End Layout Components Imports ---


// function Sidebar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const {
//     navItems,
//     addItem,
//     updateItem,
//     logo,
//     updateLogo,
//     setActivePageId,
//     selectedLayouts,
//     setLayoutForPage
//   } = useNavigation();

//   // Logo state
//   const [logoText, setLogoText] = useState(logo.text);
//   const [logoImage, setLogoImage] = useState(logo.image);
//   const [tempLogoText, setTempLogoText] = useState(logo.text);
//   const [tempLogoImage, setTempLogoImage] = useState(logo.image);
//   const [showLogoEdit, setShowLogoEdit] = useState(false);

//   // New page link state
//   const [newLink, setNewLink] = useState('');
//   const [showAddInput, setShowAddInput] = useState(false);

//   // Editing existing nav item state
//   const [editingId, setEditingId] = useState(null);
//   const [editingText, setEditingText] = useState('');

//   // Layout picker state
//   const [layoutPickerOpenId, setLayoutPickerOpenId] = useState(null);

//   // --- State and Refs for Responsive Layout Picker ---
//   const previewRef = useRef(null); // Ref to measure the width of a single layout preview container
//   const [previewWidth, setPreviewWidth] = useState(0);

//   // Define the standard desktop width your layouts are designed for
//   const DESKTOP_DESIGN_WIDTH = 1280; // Example: Your layouts are designed for a 1280px wide viewport

//   useEffect(() => {
//     // Function to update the preview width
//     const handleResize = () => {
//       // Only measure if the ref is attached (i.e., the element is rendered)
//       // and we are dealing with a layout picker being open.
//       // We'll use the first item's preview for measurement as they should all be uniform.
//       if (previewRef.current) {
//         setPreviewWidth(previewRef.current.offsetWidth);
//       }
//     };

//     // Set initial width when the component mounts
//     handleResize();

//     // Add event listener for window resize to update width dynamically
//     window.addEventListener('resize', handleResize);

//     // Clean up the event listener when the component unmounts
//     return () => window.removeEventListener('resize', handleResize);
//   }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount
//   // --- End State and Refs for Responsive Layout Picker ---


//   const handleLogoImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setTempLogoImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const saveLogoChanges = () => {
//     updateLogo({ text: tempLogoText, image: tempLogoImage });
//     setLogoText(tempLogoText); // Update logoText state for current display
//     setLogoImage(tempLogoImage); // Update logoImage state for current display
//     setShowLogoEdit(false);
//   };

//   const cancelLogoChanges = () => {
//     setTempLogoText(logoText); // Revert to original logoText
//     setTempLogoImage(logoImage); // Revert to original logoImage
//     setShowLogoEdit(false);
//   };

//   const handleNavClick = (item) => {
//     const path = item.slug === 'home' ? '/' : `/${item.slug}`;
//     const isOnAllPage = location.pathname === '/' || location.pathname === '/all'; // Assuming '/all' is your main editing view

//     if (isOnAllPage) {
//       setActivePageId(item.id);
//     } else {
//       navigate('/'); // Navigate to the main editing view first
//       setTimeout(() => {
//         setActivePageId(item.id); // Then set the active page
//       }, 100); // Small delay to allow navigation to complete
//     }
//   };

//   // --- Responsive renderLayoutPicker function ---
//   const renderLayoutPicker = (item) => {
//     return (
//       // Outer container for the picker (handles overall centering and max-width)
//       <div className="flex justify-center w-full px-2 py-4"> {/* Added padding and full width */}
//         {/* Main picker container: responsive width, scrollable, and styled */}
//         <div className="bg-gray-700 p-4 rounded-lg shadow-xl space-y-6 w-full max-w-sm"> {/* Max-w-sm for narrow sidebar */}
//           {/* Title for the layout picker (optional, but good for UX) */}
//           <h3 className="text-lg font-bold text-white text-center mb-3">Select Layout for "{item.title}"</h3>

//           {/* Grid or flex container for the layout options */}
//           <div className="grid grid-cols-1 gap-6"> {/* Always 1 column inside the narrow sidebar */}
//             {Object.entries(LayoutComponents).map(([key, LayoutComp]) => {
//               const isSelected = selectedLayouts[item.id] === key;

//               // Calculate dynamic scale only if previewWidth is available
//               const scaleFactor = previewWidth ? (previewWidth / DESKTOP_DESIGN_WIDTH) : 0;

//               // Style object for the scaled content
//               const transformStyle = {
//                 transform: `scale(${scaleFactor})`,
//                 transformOrigin: 'top left', // Scale from the top-left corner
//                 width: DESKTOP_DESIGN_WIDTH, // The original width of the component before scaling
//                 height: 'auto', // Allow height to adjust naturally with scale
//               };

//               return (
//                 <div
//                   key={key}
//                   onClick={() => {
//                     setLayoutForPage(item.id, key); // Select the layout for the current item
//                     setLayoutPickerOpenId(null);   // Close the layout picker
//                   }}
//                   className="cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02] group"
//                 >
//                   <div
//                     // Attach ref to the first element's preview container to measure its width.
//                     // This assumes all preview containers will have the same calculated width.
//                     ref={key === Object.keys(LayoutComponents)[0] ? previewRef : null}
//                     className={`w-full aspect-video mx-auto bg-white overflow-hidden relative rounded-lg border-4 ${
//                       isSelected ? 'border-cyan-500 ring-4 ring-cyan-500 shadow-cyan-400/50' : 'border-transparent'
//                     } group-hover:border-cyan-400 shadow-md`}
//                   >
//                     {/* The scaled content is absolutely positioned to ensure it fits within the aspect-video container */}
//                     <div className="absolute top-0 left-0" style={transformStyle}>
//                       {/* Use React.Suspense for lazy loading of components */}
//                       <Suspense fallback={<div className="bg-gray-700 flex items-center justify-center w-full h-full text-white text-sm">Loading...</div>}>
//                         {/* Render the actual layout component with isEditing={false} for preview */}
//                         <LayoutComp isEditing={false} />
//                       </Suspense>
//                     </div>
//                   </div>
//                   {/* Display the layout name below the preview */}
//                   <div className="text-center mt-2 text-white font-semibold text-base">
//                     {key.replace(/([A-Z])/g, ' $1').trim()} {/* Formats "HeroLayout" to "Hero Layout" */}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     );
//   };
//   // --- End Responsive renderLayoutPicker function ---

//   return (
//     // Main Sidebar container
//     <aside className="min-w-[16rem] max-w-[20rem] w-full bg-gray-700 p-4 text-gray-100 flex flex-col h-screen overflow-y-auto">
//       {/* LOGO EDIT SECTION */}
//       <section className="mb-6 border-b border-gray-600 pb-4">
//         {showLogoEdit ? (
//           <>
//             <label htmlFor="logo-text-input" className="block text-sm font-medium mb-1">Logo Text:</label>
//             <input
//               id="logo-text-input"
//               type="text"
//               value={tempLogoText}
//               onChange={(e) => setTempLogoText(e.target.value)}
//               className="w-full px-3 py-1 mb-3 text-gray-900 rounded bg-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               placeholder="Enter logo text"
//             />
//             <label htmlFor="logo-image-input" className="block text-sm font-medium mb-1">Logo Image:</label>
//             <div className="flex items-center gap-3 mb-2">
//               {tempLogoImage ? (
//                 <img src={tempLogoImage} alt="Logo Preview" className="h-16 w-auto object-contain bg-white p-1 rounded" />
//               ) : (
//                 <span className="text-sm text-gray-400">No image selected.</span>
//               )}
//             </div>
//             <input
//               id="logo-image-input"
//               type="file"
//               accept="image/*"
//               onChange={handleLogoImageChange}
//               className="mb-4 text-sm text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-500"
//             />
//             <div className="flex gap-2">
//               <button onClick={saveLogoChanges} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded transition">
//                 Save
//               </button>
//               <button onClick={cancelLogoChanges} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition">
//                 Cancel
//               </button>
//             </div>
//           </>
//         ) : (
//           <button
//             onClick={() => setShowLogoEdit(true)}
//             className="w-full bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 flex items-center justify-between rounded transition"
//           >
//             <span>Edit Logo</span>
//             <FaEdit className="text-lg" />
//           </button>
//         )}
//       </section>

//       {/* ADD NEW PAGE SECTION */}
//       <section className="mb-6 border-b border-gray-600 pb-4">
//         {showAddInput ? (
//           <>
//             <label htmlFor="new-page-input" className="block text-sm font-medium mb-1">New Page Name:</label>
//             <input
//               id="new-page-input"
//               type="text"
//               placeholder="e.g., Services"
//               value={newLink}
//               onChange={(e) => setNewLink(e.target.value)}
//               className="w-full px-3 py-1 border mb-2 text-gray-900 rounded bg-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//             />
//             <div className="flex gap-2">
//               <button
//                 onClick={() => {
//                   if (newLink.trim() !== '') {
//                     addItem(newLink);
//                     setNewLink('');
//                     setShowAddInput(false);
//                   }
//                 }}
//                 className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded transition"
//               >
//                 Add Page
//               </button>
//               <button
//                 onClick={() => {
//                   setNewLink('');
//                   setShowAddInput(false);
//                 }}
//                 className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </>
//         ) : (
//           <button
//             onClick={() => setShowAddInput(true)}
//             className="w-full bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 flex items-center justify-between rounded transition"
//           >
//             <span>Add New Page</span>
//             <FaPlus className="text-lg" />
//           </button>
//         )}
//       </section>

//       {/* NAV ITEMS LIST */}
//       <nav className="flex-grow"> {/* Use nav element for semantic correctness */}
//         <ul className="space-y-2">
//           {navItems.map((item) => {
//             const path = `/${item.slug}`;
//             const isActive =
//               location.pathname === path || (item.slug === 'home' && location.pathname === '/');

//             return (
//               <li key={item.id} className="relative bg-gray-800 rounded">
//                 {editingId === item.id ? (
//                   <div className="flex items-center p-2">
//                     <input
//                       value={editingText}
//                       onChange={(e) => setEditingText(e.target.value)}
//                       className="text-white flex-grow px-2 py-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter') {
//                           updateItem(item.id, editingText);
//                           setEditingId(null);
//                         }
//                       }}
//                       autoFocus
//                     />
//                     <button
//                       onClick={() => {
//                         updateItem(item.id, editingText);
//                         setEditingId(null);
//                       }}
//                       className="ml-2 text-cyan-400 hover:text-cyan-300"
//                       title="Save"
//                     >
//                       <FaEdit />
//                     </button>
//                     <button
//                       onClick={() => setEditingId(null)}
//                       className="ml-1 text-red-500 hover:text-red-400"
//                       title="Cancel"
//                     >
//                       &times;
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-between p-2">
//                     <button
//                       onClick={() => handleNavClick(item)}
//                       className={`flex-grow text-left py-1 px-2 rounded-md transition-colors ${isActive ? 'bg-cyan-700 text-white font-semibold' : 'text-gray-200 hover:bg-gray-600'
//                         }`}
//                       title={`Go to ${item.title}`}
//                     >
//                       {item.title}
//                     </button>

//                     {/* Edit button */}
//                     <button
//                       onClick={() => {
//                         setEditingId(item.id);
//                         setEditingText(item.title);
//                       }}
//                       title="Edit page name"
//                       className="ml-2 text-cyan-400 hover:text-cyan-300 transition"
//                     >
//                       <FaEdit />
//                     </button>

//                     {/* Settings icon / Layout picker toggle */}
//                     <button
//                       onClick={() =>
//                         setLayoutPickerOpenId((prev) => (prev === item.id ? null : item.id))
//                       }
//                       title="Select layout"
//                       className="ml-2 text-gray-300 hover:text-cyan-400 transition"
//                     >
//                       <FaThLarge />
//                     </button>
//                   </div>
//                 )}

//                 {/* Layout picker rendered conditionally */}
//                 {layoutPickerOpenId === item.id && renderLayoutPicker(item)}
//               </li>
//             );
//           })}
//         </ul>
//       </nav>
//     </aside>
//   );
// }

// export default Sidebar;
















import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPlus, FaEdit, FaThLarge, FaCog } from 'react-icons/fa';
import { useNavigation } from '../context/NavigationContext';


// --- IMPORTANT: Layout Components are NOT rendered directly in sidebar now ---
// We still need their mapping to know what to display on the main canvas
// You might still import them if your `setLayoutForPage` logic needs them directly.
// If your `setLayoutForPage` only takes a string key, these imports could potentially be moved
// to the main page component that renders the layouts. For now, we'll keep them here
// as they are part of the `LayoutComponents` map.
import {
  GridLayout,
  ListLayout,
  TestimonialLayout,
  TestimonialLayout1,
  ServiceCard,
  
  HeroLayout,
  MissionVisionLayout,
  TeamLayout,
  CtaLayout,
  FullPageListLayout,
  FullPageGridLayout,
  Contactpage,
} from '../layouts';
import ContactPage from '../layouts/Contactpage';


const LayoutComponents = {
  grid: GridLayout,
  list: ListLayout,
  testimonial: TestimonialLayout,
  testimonial1: TestimonialLayout1,
  service: ServiceCard,
  hero: HeroLayout,
  missionVision: MissionVisionLayout,
  team: TeamLayout,
  cta: CtaLayout,
  fullList:FullPageListLayout,
  fullPage: FullPageGridLayout,
  contact: ContactPage
};
// --- End Layout Components Imports ---

// --- NEW: Define a mapping for your layout thumbnail images ---
// You will need to create these image files (e.g., in a 'public/thumbnails' folder)
const layoutThumbnails = {
  grid: '/thumbnails/grid-layout-thumbnail.png',
  list: '/thumbnails/list-layout-thumbnail.png',
  testimonial: '/thumbnails/testimonial-layout-thumbnail.png',
  hero: '/thumbnails/hero-layout-thumbnail.png',
  missionVision: '/thumbnails/mission-vision-layout-thumbnail.png',
  team: '/thumbnails/team-layout-thumbnail.png',
  cta: '/thumbnails/cta-layout-thumbnail.png',
  // Add a default or placeholder if a thumbnail is missing
  default: '/thumbnails/default-layout-thumbnail.png',
};
// --- End Thumbnail Mapping ---


function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    navItems,
    addItem,
    updateItem,
    logo,
    updateLogo,
    setActivePageId,
    selectedLayouts,
    setLayoutForPage,
    // pageContent // We don't need pageContent in the sidebar for image-only previews
  } = useNavigation();

  // Logo state
  const [logoText, setLogoText] = useState(logo.text);
  const [logoImage, setLogoImage] = useState(logo.image);
  const [tempLogoText, setTempLogoText] = useState(logo.text);
  const [tempLogoImage, setTempLogoImage] = useState(logo.image);
  const [showLogoEdit, setShowLogoEdit] = useState(false);

  // New page link state
  const [newLink, setNewLink] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);

  // Editing existing nav item state
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Layout picker state
  const [layoutPickerOpenId, setLayoutPickerOpenId] = useState(null);

  // --- REMOVED: State and Refs for Responsive Layout Picker are no longer needed ---
  // const previewRef = useRef(null);
  // const [previewWidth, setPreviewWidth] = useState(0);
  // const DESKTOP_DESIGN_WIDTH = 1280;
  // useEffect(() => { ... }, []);
  // --- End REMOVED ---


  const handleLogoImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempLogoImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveLogoChanges = () => {
    updateLogo({ text: tempLogoText, image: tempLogoImage });
    setLogoText(tempLogoText);
    setLogoImage(tempLogoImage);
    setShowLogoEdit(false);
  };

  const cancelLogoChanges = () => {
    setTempLogoText(logoText);
    setTempLogoImage(logoImage);
    setShowLogoEdit(false);
  };

  const handleNavClick = (item) => {
    const path = item.slug === 'home' ? '/' : `/${item.slug}`;
    const isOnAllPage = location.pathname === '/' || location.pathname === '/all';

    if (isOnAllPage) {
      setActivePageId(item.id);
    } else {
      navigate('/');
      setTimeout(() => {
        setActivePageId(item.id);
      }, 100);
    }
  };

  // --- MODIFIED: renderLayoutPicker now renders images instead of live components ---
  const renderLayoutPicker = (item) => {
    return (
      <div className="flex justify-center w-full px-2 py-4">
        <div className="bg-gray-700 p-4 rounded-lg shadow-xl space-y-6 w-full max-w-sm">
          <h3 className="text-lg font-bold text-white text-center mb-3">Select Layout for "{item.title}"</h3>

          <div className="grid grid-cols-1 gap-6">
            {Object.entries(LayoutComponents).map(([key, LayoutComp]) => { // LayoutComp is not used here, but key is
              const isSelected = selectedLayouts[item.id] === key;
              // --- Get the thumbnail URL for the current layout type ---
              const thumbnailUrl = layoutThumbnails[key] || layoutThumbnails.default;

              return (
                <div
                  key={key}
                  onClick={() => {
                    setLayoutForPage(item.id, key); // This will tell the main canvas what to render
                    setLayoutPickerOpenId(null); // Close the picker
                  }}
                  className="cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02] group"
                >
                  <div
                    // --- This div now holds the image, no scaling or ref needed here ---
                    className={`w-full aspect-video mx-auto bg-white overflow-hidden relative rounded-lg border-4 ${
                      isSelected ? 'border-cyan-500 ring-4 ring-cyan-500 shadow-cyan-400/50' : 'border-transparent'
                    } group-hover:border-cyan-400 shadow-md flex items-center justify-center`}
                  >
                    {/* --- Display the static thumbnail image --- */}
                    <img
                      src={thumbnailUrl}
                      alt={`${key} Layout Thumbnail`}
                      className="w-full h-full object-cover" // Ensures image covers the preview area
                    />
                  </div>
                  <div className="text-center mt-2 text-white font-semibold text-base">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  // --- End MODIFIED renderLayoutPicker function ---

  return (
    <aside className="min-w-[16rem] max-w-[20rem] w-full min-h-screen bg-gray-700 p-4 text-gray-100 flex flex-col  overflow-y-auto mt-13">
      {/* LOGO EDIT SECTION */}
      <section className="mb-6 border-b border-gray-600 pb-4">
        {showLogoEdit ? (
          <>
            <label htmlFor="logo-text-input" className="block text-sm font-medium mb-1">Logo Text:</label>
            <input
              id="logo-text-input"
              type="text"
              value={tempLogoText}
              onChange={(e) => setTempLogoText(e.target.value)}
              className="w-full px-3 py-1 mb-3 text-gray-900 rounded bg-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter logo text"
            />
            <label htmlFor="logo-image-input" className="block text-sm font-medium mb-1">Logo Image:</label>
            <div className="flex items-center gap-3 mb-2">
              {tempLogoImage ? (
                <img src={tempLogoImage} alt="Logo Preview" className="h-16 w-auto object-contain bg-white p-1 rounded" />
              ) : (
                <span className="text-sm text-gray-400">No image selected.</span>
              )}
            </div>
            <input
              id="logo-image-input"
              type="file"
              accept="image/*"
              onChange={handleLogoImageChange}
              className="mb-4 text-sm text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-500"
            />
            <div className="flex gap-2">
              <button onClick={saveLogoChanges} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded transition">
                Save
              </button>
              <button onClick={cancelLogoChanges} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setShowLogoEdit(true)}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 flex items-center justify-between rounded transition"
          >
            <span>Edit Logo</span>
            <FaEdit className="text-lg" />
          </button>
        )}
      </section>

      {/* ADD NEW PAGE SECTION */}
      <section className="mb-6 border-b border-gray-600 pb-4">
        {showAddInput ? (
          <>
            <label htmlFor="new-page-input" className="block text-sm font-medium mb-1">New Page Name:</label>
            <input
              id="new-page-input"
              type="text"
              placeholder="e.g., Services"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              className="w-full px-3 py-1 border mb-2 text-gray-900 rounded bg-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (newLink.trim() !== '') {
                    addItem(newLink);
                    setNewLink('');
                    setShowAddInput(false);
                  }
                }}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded transition"
              >
                Add Page
              </button>
              <button
                onClick={() => {
                  setNewLink('');
                  setShowAddInput(false);
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setShowAddInput(true)}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 flex items-center justify-between rounded transition"
          >
            <span>Add New Page</span>
            <FaPlus className="text-lg" />
          </button>
        )}
      </section>

      {/* NAV ITEMS LIST */}
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const path = `/${item.slug}`;
            const isActive =
              location.pathname === path || (item.slug === 'home' && location.pathname === '/');

            return (
              <li key={item.id} className="relative bg-gray-800 rounded">
                {editingId === item.id ? (
                  <div className="flex items-center p-2">
                    <input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="text-white flex-grow px-2 py-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateItem(item.id, editingText);
                          setEditingId(null);
                        }
                      }}
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        updateItem(item.id, editingText);
                        setEditingId(null);
                      }}
                      className="ml-2 text-cyan-400 hover:text-cyan-300"
                      title="Save"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="ml-1 text-red-500 hover:text-red-400"
                      title="Cancel"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2">
                    <button
                      onClick={() => handleNavClick(item)}
                      className={`flex-grow text-left py-1 px-2 rounded-md transition-colors ${isActive ? 'bg-cyan-700 text-white font-semibold' : 'text-gray-200 hover:bg-gray-600'
                        }`}
                      title={`Go to ${item.title}`}
                    >
                      {item.title}
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditingText(item.title);
                      }}
                      title="Edit page name"
                      className="ml-2 text-cyan-400 hover:text-cyan-300 transition"
                    >
                      <FaEdit />
                    </button>

                    {/* Settings icon / Layout picker toggle */}
                    <button
                      onClick={() =>
                        setLayoutPickerOpenId((prev) => (prev === item.id ? null : item.id))
                      }
                      title="Select layout"
                      className="ml-2 text-gray-300 hover:text-cyan-400 transition"
                    >
                      <FaThLarge />
                    </button>
                  </div>
                )}

                {/* Layout picker rendered conditionally */}
                {layoutPickerOpenId === item.id && renderLayoutPicker(item)}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;