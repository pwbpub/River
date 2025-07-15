// Clean Slate App.js Solution
import React, { Suspense } from 'react';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme-mui';
import Nav from './components/Nav';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Box, CircularProgress } from '@mui/material';

// Import backgrounds
import backgroundImage from './images/VerticalCubesBackground96.jpg';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// LAZY LOAD YOUR PAGES
const EnterBookPage = React.lazy(() => import('./pages/EnterBookPage'));
const EnterVibePage = React.lazy(() => import('./pages/EnterVibePage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Create a loading fallback component
const PageLoader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <>
      {/* ONLY the main background - radial fade moved back to page level */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -10,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      />

      {/* Application content */}
      <ThemeProvider theme={theme}>
        <HelmetProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Nav>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<EnterBookPage />} />
                  <Route path="/book" element={<EnterBookPage />} />
                  <Route path="/vibe" element={<EnterVibePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </Nav>
          </Router>
        </HelmetProvider>
      </ThemeProvider>
    </>
  );
}

export default App;