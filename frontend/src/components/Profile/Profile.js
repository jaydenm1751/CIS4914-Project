import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { UserContext } from '../../contexts/UserContext';
import { db } from '../../config/firebase'; // Firestore and Auth imports
import { doc, getDoc } from 'firebase/firestore'; // Firestore imports
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  Avatar,
  TextField,
} from '@mui/material';
import './Profile.css'; 
import profilePicture from '../../assets/images/profilePicture.jpg';

const Profile = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate(); // Initialize useNavigate

  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('User is not logged in. Redirecting to login...');
        navigate('/login?redirect=/profile');
      } else {
        setProfileLoading(true);

        const fetchProfile = async () => {
          try {
            const docRef = doc(db, 'profiles', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              setProfile(docSnap.data());
            } else {
              console.log("The profile doesn't exist!");
            }
          } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile data');
          } finally {
            setProfileLoading(false);
          }
        };

        fetchProfile();
      }
    }
  }, [user, loading, navigate]);

  if (loading || profileLoading) return <p>Loading profile...</p>
  if (error) return <p>{error}</p>

  const profileData = { 
    username = 'No username', 
    name = 'No name',
    email = 'No email', 
    phone = 'No phone',
    bio = 'No bio available', 
    role = 'No role',
    avatar = 'https://via.placeholder.com/150' 
  } = profile;

  const updateProfile = async (docId, newData) => {
    try {
      const docRef = doc(db, 'your-collection-name', docId);      
      await updateDoc(docRef, newData);
      
      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Avatar
              alt={username}
              src={avatar}
              sx={{ width: 150, height: 150, margin: 'auto' }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {role}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {email}
            </Typography>
            <Typography variant="body1" style={{ marginTop: '10px' }}>
              {bio}
            </Typography>
            <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
              Edit Profile
            </Button>
          </Grid>
        </Grid>

        {/* Additional Information Section */}
        <Typography variant="h5" gutterBottom style={{ marginTop: '30px' }}>
          Additional Information
        </Typography>
        <TextField
          fullWidth
          label="Address"
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Phone Number"
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Bio"
          variant="outlined"
          margin="normal"
          multiline
          rows={4}
        />
        <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Save Changes
        </Button>
      </Paper>
    </Container>
  );
};

export default Profile;
