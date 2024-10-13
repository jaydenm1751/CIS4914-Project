//Background image source for temp reference: https://unsplash.com/photos/orange-and-black-sofa-with-throw-pillows-q3Qd86sfaoU 

import React, { useState } from 'react';
import Auth from './Auth';
import './Auth.css'; 
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Tabs,
  Tab,
  Box,
  TextField,
  Divider,
} from '@mui/material';
import { ReactComponent as GoogleLogo } from '../../assets/images/Google__G__logo.svg';

const AuthRedirect = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  // Function to handle tab change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Function to handle button click under each TextField
  const handleButtonClick = (tab) => {
//    alert(`Button clicked in ${tab} with value: ${textFields[tab]}`);
  };

  return (
    <div className="background">
      {/* Dialog component */}
      <Dialog
        open={true}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown
        onClose={null}
        BackdropProps={{ style: { backgroundColor: 'transparent' } }}  // Disable grey dialog background
      >
        <DialogTitle variant='h4' align="center" sx={{ fontWeight: 'bold' }}>
          Welcome to Subleaser
        </DialogTitle>

        <DialogContent>
          {/* Log in/Sign up Tabs */}
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="tabs example">
            <Tab sx={{ fontWeight: 'bold' }} label="Log In" />
            <Tab sx={{ fontWeight: 'bold' }} label="Sign Up" />
          </Tabs>

          {/* Login Tab */}
          <Box sx={{ padding: 2 }}>
            {tabIndex === 0 && (
              <div>
                {/* Email Field */}
                <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Email
                </Typography>
                <TextField
                  label="Enter email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password Field */}
                <Typography variant="body1" gutterBottom sx={{ marginTop: 2, fontWeight: 'bold' }}>
                  Password
                </Typography>
                <TextField
                  label="Enter password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginTop: 2 }}
                  onClick={() => handleButtonClick('Tab 1')}
                >
                  Log In
                </Button>
              </div>
            )}
            {/* Sign Up Tab */}
            {tabIndex === 1 && (
              <div>
                {/* Email Field */}
                <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Email
                </Typography>
                <TextField
                  label="Enter email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password Field */}
                <Typography variant="body1" gutterBottom sx={{ marginTop: 2, fontWeight: 'bold' }}>
                  Password
                </Typography>
                <TextField
                  label="Enter password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginTop: 2 }}
                  onClick={() => handleButtonClick('Tab 1')}
                >
                  Register
                </Button>
              </div>
            )}

            <Divider sx={{ margin: '16px 0' }} /> {/* Divider */}

            <Typography variant='body1' align="center">
              Or connect with:
            </Typography>

            {/* Google Button */}
            <Button
              variant="contained"
              color="white"
              fullWidth
              onClick={() => alert('Google button clicked')}
              sx={{
                marginTop: 2,
                display: 'flex', // Use flex layout
                justifyContent: 'center', // Center content horizontally
                alignItems: 'center', // Center content vertically
              }}
            >
              {/* Google logo inside the button */}
              <GoogleLogo style={{ marginRight: 8, width: '24px', height: '24px' }} />

              Continue with Google
            </Button>
            
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthRedirect;
