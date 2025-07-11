// src/pages/NotFoundPage.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        textAlign: 'center',
        color: 'white'
      }}
    >
      <Typography variant="h1" component="h1" sx={{ color: 'primary.contrastText', mb: 2 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ color: 'primary.contrastText', mb: 4 }}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Button component={Link} to="/" variant="contained" color="secondary">
        Go Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;