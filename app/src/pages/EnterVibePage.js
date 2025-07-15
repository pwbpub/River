import React, { useState, useEffect } from 'react';
import {Box} from '@mui/material';
import MUIOutputRecommendation from '../components/MUIOutputRecommendation';
import openbook from '../images/openbook.png';
import radialFade from '../images/radial-fade.png';
import MUIVibeInput from '../components/MUIVibeInput';
import { Helmet }  from 'react-helmet-async';

const EnterVibePage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');
  const [isInputCollapsed, setIsInputCollapsed] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());

  useEffect(() => {
    if ((recommendations && recommendations.length > 0) || error) {
      setIsInputCollapsed(true);
    }
  }, [recommendations, error]);

  const handleReset = () => {
    setRecommendations([]);
    setError('');
    setIsInputCollapsed(false);
    setInputKey(Date.now());
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Helmet>
        <title>Book Finder - Reveal Your Dream Book</title>
        <meta name="description" content="Get a book recommendation customized to you. Fiction, fantasy, romance, horror. Find the next read that you or your book club will love." />
      </Helmet>

      {/* Logo container with CSS background radial fade */}
      <Box 
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 2, sm: 4 },
          pb: 0.5,
          width: '100%',
          // CSS background approach - clean and reliable
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            // Simple responsive sizing without complex clamp
            width: {
              xs: '400px',
              sm: '500px', 
              md: '550px',
              lg: '600px'
            },
            height: {
              xs: '400px',
              sm: '500px',
              md: '550px', 
              lg: '600px'
            },
            backgroundImage: `url(${radialFade})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            pointerEvents: 'none',
            zIndex: -1
          }
        }}
      >
        {/* Logo */}
        <Box 
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img 
            src={openbook} 
            alt="Book Logo" 
            style={{ 
              maxWidth: '250px',
              width: '60vw',
              height: 'auto',
              marginBottom: '1rem'
            }} 
          />
        </Box>
      </Box>

      <MUIVibeInput
        key={inputKey}
        setRecommendations={setRecommendations}
        setError={setError}
        isInputCollapsed={isInputCollapsed}
        setIsInputCollapsed={setIsInputCollapsed}
        onReset={handleReset}
      />

      <MUIOutputRecommendation
        recommendations={recommendations}
        error={error}
      />      
    </Box>
  );
};

export default EnterVibePage;