import React from 'react';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
// import { CssBaseline } from '@mui/material/CssBaseline';
import theme from './theme-mui';
// import nav from './components/NavigationAndLayout';
// import EnterBookPage from './pages/EnterBookPage';
// import EnterVibePage from './pages/EnterVibePage'
// import OutputRecommendation from './components/OutputRecommendation';
// import { Router } from 'express';

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* <Router> */}
         {/* <nav>  
          <Routes>
            <Route path="/" element={<EnterBookPage />} />
            <Route path="/book" element={<EnterBookPage />} />
            <Route path="/vibe" element={<EnterVibePage />} />
          </Routes>
        </nav>  */}
      {/* </Router> */}
    </ThemeProvider>
  );
}

export default App;