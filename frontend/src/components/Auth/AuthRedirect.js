//Background image source for temp reference: https://unsplash.com/photos/orange-and-black-sofa-with-throw-pillows-q3Qd86sfaoU 

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { UserContext } from '../../contexts/UserContext';
import { auth } from '../../config/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider
} from 'firebase/auth';
import Login from './Login';
import Signup from './Signup';
import ResetPassword from './ResetPassword';
import './Auth.css'; 
import {
  Card,
  CardContent,
  CardHeader,
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
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (user !== null) {
      console.log('User is logged in:', user);
      navigate('/'); // Navigate to the homwe page
    }
  }, [user]); // The effect will run whenever `user` changes

  // Function to handle tab change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const loginWithGoogle = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    
    signInWithPopup(auth, provider)
    .catch((err) => {
      console.error(err);
    });
  }

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
              <div>
              <ResetPassword />
              <Button
                  variant="text"
                  fullWidth
                  sx={{ fontWeight: 'bold'}}
                  onClick={() => setTabIndex(0)}
              >
                  Remember your password?
              </Button>
          </div>
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
                  onClick={() => loginWithGoogle()}
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
