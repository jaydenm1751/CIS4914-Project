//Background image source for temp reference: https://unsplash.com/photos/orange-and-black-sofa-with-throw-pillows-q3Qd86sfaoU 

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { UserContext } from '../../contexts/UserContext';
import Login from './Login';
import Signup from './Signup';
import ResetPassword from './ResetPassword';
import './Auth.css'; 
import {
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Tabs,
  Tab,
  Box,
  Divider
} from '@mui/material';
import { ReactComponent as GoogleLogo } from '../../assets/images/Google__G__logo.svg';

const AuthRedirect = () => {
  const { user } = useContext(UserContext);

  const [tabIndex, setTabIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (user !== null) {
      console.log('User is logged in:', user);
      navigate('/'); // Navigate to the search page
    }
  }, [user]); // The effect will run whenever `user` changes

  // Function to handle tab change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div className="background">
      {/* Card component */}
      <Card maxWidth="sm" sx={{  margin: 'auto', padding: 3 }}>
        <CardHeader
          title="Welcome to Subleaser"
          titleTypographyProps={{ variant: 'h4', align: 'center', sx: { fontWeight: 'bold' } }}
        />

        <CardContent>
          {/* Reset password or tabs */}
          {tabIndex === 2 ? (
            <ResetPassword />
          ) : (
            <div>
              <Tabs value={tabIndex} onChange={handleTabChange} aria-label="tabs example" centered>
                <Tab label="Log In" />
                <Tab label="Sign Up" />
              </Tabs>

              {/* Tab Content */}
              <Box sx={{ padding: 2 }}>
                {tabIndex === 0 && (
                  <div>
                    <Login />
                    <Button
                      variant="text"
                      fullWidth
                      sx={{ fontWeight: 'bold', marginTop: 2 }}
                      onClick={() => setTabIndex(2)}
                    >
                      Forgot your password?
                    </Button>
                  </div>
                )}
                {tabIndex === 1 && <Signup />}

                <Divider sx={{ margin: '16px 0' }} /> {/* Divider */}

                <Typography variant="body1" align="center">
                  Or connect with:
                </Typography>

                {/* Google Button */}
                <Button
                  variant="contained"
                  color="primary"
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
                  Connect with Google
                </Button>
              </Box>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthRedirect;
