import React, { useState, useEffect } from 'react';
import {Box} from '@mui/material';
import MUIBookInput from '../components/MUIBookInput';
import MUIOutputRecommendation from '../components/MUIOutputRecommendation';
import openbook from '../images/openbook.png';
import radialFade from '../images/radial-fade.png';

const EnterBookPage = () => {
  // State for recommendations, errors, and the collapsed state
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');
  const [isInputCollapsed, setIsInputCollapsed] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now()); // Key to force-reset the input component

  /**
   * This effect listens for changes to recommendations or errors.
   * If either of them have content, it triggers the input component to collapse.
   */
  useEffect(() => {
    if ((recommendations && recommendations.length > 0) || error) {
      setIsInputCollapsed(true);
    }
  }, [recommendations, error]);

  /**
   * Handles the reset button. It clears all the state, returning the
   * app to its initial view, and changes the key of the MUIBookInput
   * component to ensure its internal state is reset.
   */
  const handleReset = () => {
    setRecommendations([]);
    setError('');
    setIsInputCollapsed(false);
    setInputKey(Date.now());
  };


  return (
     <>
      {/* Container for logo and radial fade*/}
      <Box 
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
          mb: 0.5,
          width: '100%'
        }}
      >
        {/* Radial fade */}
        <Box
          sx={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
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
              height: 'auto',
              marginBottom: '1rem'
            }} 
          />
        </Box>
      </Box>

      <MUIBookInput 
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
    </>
  );
};

export default EnterBookPage;
