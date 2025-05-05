import React from 'react';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme-mui';
import Nav from './components/Nav';
import EnterBookPage from './pages/EnterBookPage';
import EnterVibePage from './pages/EnterVibePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
         <Nav>
          <Routes>
            <Route path="/" element={<EnterBookPage />} />
            <Route path="/book" element={<EnterBookPage />} />
            <Route path="/vibe" element={<EnterVibePage />} />
          </Routes>
        </Nav>
      </Router>
    </ThemeProvider>
  );
}

export default App;