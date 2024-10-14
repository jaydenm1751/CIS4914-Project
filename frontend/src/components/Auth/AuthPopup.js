import React, { useState, useContext } from 'react';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { UserContext } from '../../contexts/UserContext';
import './Auth.css';
import Login from './Login';
import Signup from './Signup';
import ResetPassword from './ResetPassword';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Tabs,
  Tab,
  Box,
  Divider,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReactComponent as GoogleLogo } from '../../assets/images/Google__G__logo.svg';

import Auth from './Auth';
import { ClassNames } from '@emotion/react';

const AuthPopup = () => {
    const { user } = useContext(UserContext);

    const [isOpen, setIsOpen] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);

    const togglePopup = () => {
        setIsOpen(!isOpen);
        setTabIndex(0);
    };
  
    const logout = async () => {
        try{
        console.log("logging out user")
        await signOut(auth);
        } catch (error) {
        console.error("Error during sign-out:", error);
        }
    }
    
    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <div className="App">
            {user ? (
                <button className='logout-button' onClick={logout}>Log Out</button>
            ) : (
                <div>
                    <button className='popup-button' onClick={togglePopup}>Log In</button>

                    {isOpen && (
                        <div>
                            {/* Dialog component */}
                            <Dialog 
                                open={isOpen}
                                maxWidth="sm"
                                fullWidth
                                onClose={togglePopup}
                            >
                                <DialogTitle variant='h4' align="center" sx={{ fontWeight: 'bold' }}>
                                    Welcome to Subleaser

                                    {/* IconButton to close the dialog */}
                                    <IconButton
                                        edge="end"
                                        color="inherit"
                                        onClick={togglePopup}  // Event handler for closing the dialog
                                        aria-label="close"
                                        style={{ position: 'absolute', right: 20, top: 10 }}  // Absolute positioning
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </DialogTitle>

                                <DialogContent>
                                {/* Reset password or tabs */}
                                {tabIndex === 2 ? (
                                    <ResetPassword />
                                    ) : (
                                    <div>
                                        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="tabs example">
                                        <Tab label="Log In" />
                                        <Tab label="Sign Up" />
                                        </Tabs>

                                        {/* Tab Content */}
                                        <Box sx={{ padding: 2 }}>
                                            {tabIndex === 0 && (
                                                <div>
                                                    <Login/>
                                                    <Button
                                                        variant="text"
                                                        fullwidth
                                                        sx={{ fontWeight: 'bold'}}
                                                        onClick={() => setTabIndex(2)}
                                                    >
                                                        Forgot your password?
                                                    </Button>
                                                </div>
                                            )}
                                            {tabIndex === 1 && (
                                                <Signup/>
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
                                    </div>
                                    )
                                } 
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AuthPopup;