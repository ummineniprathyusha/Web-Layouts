// import { useState } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Layout from './components/Layout';
// import DynamicPage from './pages/DynamicPage';

// function App() {
//   // Page data state
//   const [pages, setPages] = useState({
//     home: { title: 'Home', description: 'Welcome to the homepage.' },
//     about: { title: 'About', description: 'Learn more about us.' },
//     promo: { title: 'Promo', description: 'Current promotions and deals.' },
//     services: { title: 'Services', description: 'What we offer.' },
//     testimonials: { title: 'Testimonials', description: 'What our customers say.' },
//     contact: { title: 'Contact', description: 'Get in touch with us.' },
//     review: { title: 'Review', description: 'Leave your feedback.' },
//   });

//   return (
//     <Layout pages={pages}>
//       <Routes>
//         {/* Generate routes dynamically from page keys */}
//         {Object.keys(pages).map((key) => (
//           <Route
//             key={key}
//             path={`/${key}`}
//             element={
//               <DynamicPage
//                 pageKey={key}
//                 pages={pages}
//                 setPages={setPages}
//               />
//             }
//           />
//         ))}

//         {/* Fallback route (optional) */}
//         <Route
//           path="/:pageName"
//           element={<DynamicPage pages={pages} setPages={setPages} />}
//         />
//       </Routes>
//     </Layout>
//   );
// }

// export default App;




import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { NavigationProvider } from './context/NavigationContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import MainNavbar from './components/MainNavbar';
import AllPagesView from './components/AllPagesView';
import TermsAndConditions from '../src/layouts/Termsandconditions';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <NavigationProvider>
        <div className="flex flex-col min-h-screen">
          <MainNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <div className="flex flex-1 overflow-hidden">
            {sidebarOpen && <Sidebar />}

            <div className="flex-1 flex flex-col">
              <Navbar />

              <div className="flex-1 pt-4 overflow-auto">
                <Routes>
                  <Route path="/terms" element={<TermsAndConditions />} />
                  <Route path="*" element={<AllPagesView />} />            
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </NavigationProvider>
    </Router>
  );
}

export default App;



