import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './components/navbar.tsx';
import { Box, Typography } from '@mui/material';
import { getAndParseJWT } from './components/jwt.tsx';

const Footer = () => (
  <Box
    component="footer"
    sx={{
      textAlign: 'center',
      padding: 2,
      backgroundColor: '#333',
      position: 'relative',
    }}
  >
    <Typography variant="body2" sx={{ color: 'white' }}>© 2025 HobbyHub. All rights reserved.</Typography>
  </Box>
);

const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = getAndParseJWT();
    if (!jwt) {
      navigate('/');
    }
  }, [navigate]);
  
  return (
    <Box
      sx={{
        backgroundColor: '#f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: 0, 
      }}
    >
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          padding: { xs: 1, sm: 2 },
          minHeight: '80vh', 
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
