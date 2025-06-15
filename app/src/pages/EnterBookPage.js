import React, { useState } from 'react';
import {Box} from '@mui/material';
import MUIBookInput from '../components/MUIBookInput';
import MUIOutputRecommendation from '../components/MUIOutputRecommendation';
import openbook from '../images/openbook.png';
import radialFade from '../images/radial-fade.png';

const EnterBookPage = () => {
  // Add state management for recommendations and errors
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');

  return (
     <>
      {/* Container for both logo and radial fade */}
      <Box 
        sx={{
          position: 'relative',  // Important: makes this the positioning context
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
          mb: 2,
          width: '100%'
        }}
      >
        {/* Radial fade positioned relative to container */}
        <Box
          sx={{
            position: 'absolute',
            top: '55%',  // Center vertically relative to container
            left: '50%', // Center horizontally relative to container
            transform: 'translate(-50%, -50%)', // Center the element itself
            width: '600px',
            height: '600px',
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
          <img
            src={radialFade}
            alt=""
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </Box>
        
        {/* Logo positioned relative to the same container */}
        <Box 
          sx={{
            position: 'relative', // Stacks on top of the radial fade
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
              height: 'auto',
              marginBottom: '1rem'
            }} 
          />
        </Box>
      </Box>

      <MUIBookInput 
        setRecommendations={setRecommendations} 
        setError={setError}
      />
      
      <MUIOutputRecommendation 
        recommendations={recommendations} 
        error={error} 
      />
    </>
  );
};

export default EnterBookPage;