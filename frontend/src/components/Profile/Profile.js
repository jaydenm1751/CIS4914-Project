import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { UserContext } from '../../contexts/UserContext';
import { db, storage } from '../../config/firebase'; // Firestore and Auth imports
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'; // Firestore imports
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { deleteUser } from 'firebase/auth';
import { 
  Box, 
  Container, 
  Grid, 
  Avatar, 
  Typography, 
  Divider, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button } from '@mui/material';
import './Profile.css'; 
import profilePicture from '../../assets/images/profilePicture.jpg';

const Profile = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate(); 

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState(profilePicture); 

  const handleFirstNameChange = (event) => setFirstName(event.target.value);
  const handleLastNameChange = (event) => setLastName(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePhoneChange = (event) => setPhone(event.target.value);
  const handleRoleChange = (event) => setRole(event.target.value);
  const handleStateChange = (event) => setState(event.target.value);
  const handleCityChange = (event) => setCity(event.target.value);
  const handleBioChange = (event) => setBio(event.target.value);

  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('User is not logged in. Redirecting to login...');
        navigate('/login?redirect=/profile');
      } else {
        setProfileLoading(true);        
        fetchProfile();
      }
    }
  }, [user, loading, navigate]);

 const fetchProfile = async () => {
    try {
      const docRef = doc(db, 'profiles', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const profileData = docSnap.data();

        setUsername(profileData.username || '');
        setFirstName(profileData.firstName || '');
        setLastName(profileData.lastName || '');
        setEmail(profileData.email || '');
        setRole(profileData.role || '');
        setPhone(profileData.phone || '');
        setState(profileData.state || '');
        setCity(profileData.city || '');
        setBio(profileData.bio || '');
        setProfilePictureUrl(profileData.pfpURL || '');
        
        const createdOnTimestamp = profileData.createdOn;
        const createdOnDate = createdOnTimestamp.toDate();
        const options = { year: 'numeric', month: 'long' };
        const dateString = createdOnDate.toLocaleDateString('en-US', options);
        setMemberSince(dateString);              
      } else {
        console.log("The profile doesn't exist! Creating profile...");
        createUserProfile();
        fetchProfile();
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
    } finally {
      setProfileLoading(false);
    }
  };

  const createUserProfile = async () => {
    const userProfileRef = doc(db, 'profiles', user.uid);
  
    try {
      const userProfileDoc = await getDoc(userProfileRef);

      if (!userProfileDoc.exists()) {
        const profileData = {
          uid: user.uid,
          email: user.email,
          createdOn: new Date(),
        };
  
        // For google sign in
        if (user.displayName) {
          profileData.username = user.displayName;
        }
        else {
          const emailName = user.email.split('@')[0]; // Extract username from email          
          profileData.username = emailName;
        }
        if (user.photoURL) {
          profileData.pfpURL = user.photoURL;
        }

        await setDoc(userProfileRef, profileData);
        console.log('Profile created')
      } else {
        console.log('Profile already exists. No need to create Profile')
      }
    } catch (err) {
      console.log('Error creating profile: ', err)
    }
  };

  if (loading || profileLoading) return <p>Loading profile...</p>
  if (error) return <p>{error}</p>

  const handleUpdateProfile = async() => {
    const newData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: role,
      phone: phone,
      state: state,
      city: city,
      bio: bio,
      pfpURL: profilePictureUrl, 
    };

    updateProfile(newData);
  }

  const updateProfile = async (newData) => {
    try {
      const docRef = doc(db, 'profiles', user.uid);     
      await updateDoc(docRef, newData);
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };
  
  const updateProfilePicture = async (event) => {
    const file = event.target.files[0];
    if (file) {  
      try {
        const storageRef = ref(storage, `profilePictures/${file.name}`);
        await uploadBytes(storageRef, file);  
        const url = await getDownloadURL(storageRef);

        const newData = {
          pfpURL: url, 
        };
        
        await updateProfile(newData);
        await fetchProfile();
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const deleteAccount = () => {
    // const deleteProfilePicture = async () => {
    //   const fileRef = ref(storage, profilePictureUrl);
    
    //   try {
    //     await deleteObject(fileRef);
    //     console.log("Profile picture deleted successfully!");
    //   } catch (error) {
    //     console.error("Error deleting profile picture:", error);
    //   }
    // };
    // deleteProfilePicture();

    deleteDoc(doc(db, "profiles", user.uid))
      .then(() => {
        console.log("Account deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting account:", error);
      });

    deleteUser(user)
      .then(() => {
        console.log("User account deleted successfully.");
      }).catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh', // Full height of the viewport
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Container
        sx={{
          padding: 4,
          maxWidth: '500px',
          backgroundColor: '#ffffff', 
          borderRadius: 0,
          boxShadow: 0
        }}
      >
        <Grid container spacing={2} alignItems="center" > 
        <Grid item>
          <label htmlFor="profile-pic-upload">
            <Avatar
              alt={username}
              src={profilePictureUrl}
              sx={{ width: 120, height: 120, cursor: 'pointer' }}
            />
            <input
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              onChange={updateProfilePicture}
              style={{ display: 'none' }}
            />
          </label>
          <Button 
            variant="contained" 
            component="label" 
            htmlFor="profile-pic-upload"
            size="small"
            sx={{ marginTop: 1 }}
          >
            Upload Image
          </Button>
        </Grid>

          <Grid item>
            <Typography variant="h4" fontWeight="bold">
              {username}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Member Since: {memberSince}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ marginY: 2 }} /> 

        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              value={firstName}
              onChange={handleFirstNameChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              value={lastName}
              onChange={handleLastNameChange}
            />
          </Grid>
        </Grid>

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          sx={{ marginTop: 3 }}
        />

        <Grid container spacing={2} alignItems="center" sx={{ marginTop: 2 }}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                onChange={handleRoleChange}
                label="Role"
              >
                <MenuItem value="Renter">Renter</MenuItem>
                <MenuItem value="Landlord">Landlord</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              value={phone}
              onChange={handlePhoneChange}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" sx={{ marginTop: 2 }}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                value={state}
                onChange={handleStateChange}
                label="State"
              >
                {states.map((stateName) => (
                  <MenuItem key={stateName} value={stateName}>
                    {stateName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="City"
              variant="outlined"
              fullWidth
              value={city}
              onChange={handleCityChange}
            />
          </Grid>
        </Grid>

        <TextField
          label="Bio"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={bio}
          onChange={handleBioChange}
          sx={{ marginTop: 3 }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpdateProfile}
          sx={{ marginTop: 3 }}
        >
          Update Profile
        </Button>

        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={deleteAccount}
          sx={{ marginTop: 3 }}
        >
          Delete Account
        </Button>
      </Container>
    </Box>
  );
};

export default Profile;
