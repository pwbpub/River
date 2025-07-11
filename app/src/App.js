import React from 'react';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme-mui';
import Nav from './components/Nav';
import EnterBookPage from './pages/EnterBookPage';
import EnterVibePage from './pages/EnterVibePage';
import NotFoundPage from './pages/NotFoundPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


function App() {
  // The App component serves as the main entry point for the application.
  // It sets up the router for navigation.
  return (
    <ThemeProvider theme={theme}>
      <HelmetProvider> 
         <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Nav>
            <Routes>
              <Route path="/" element={<EnterBookPage />} />
              <Route path="/book" element={<EnterBookPage />} />
              <Route path="/vibe" element={<EnterVibePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Nav>
        </Router>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;