import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { UserContext } from '../../contexts/UserContext';
import { db, storage } from '../../config/firebase'; // Firestore and Auth imports
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'; // Firestore imports
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { deleteUser } from 'firebase/auth';
import { 
  Box, 
  Paper,
  Grid, 
  Avatar, 
  Typography, 
  Divider, 
  Button } from '@mui/material';
import './Profile.css'; 
import profilePicture from '../../assets/images/profilePicture.jpg';

const Profile = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate(); 

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState('Role Not Selected');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState(profilePicture); 

  const handleFirstNameChange = (event) => setFirstName(event.target.value);
  const handleLastNameChange = (event) => setLastName(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePhoneChange = (event) => setPhone(event.target.value);
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
        setUserType(profileData.userType || '');
        setFirstName(profileData.firstName || '');
        setLastName(profileData.lastName || '');
        setEmail(profileData.email || '');
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

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = async() => {
    setIsEditing(!isEditing);

    const newData = {
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      userType: userType,
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
  
  const handleProfilePicChange = async (event) => {
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

  const handleDeleteAccount = async () => {
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

    await deleteDoc(doc(db, "profiles", user.uid))
      .then(() => {
        console.log("Account deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting account:", error);
      });

    await deleteUser(user)
      .then(() => {
        console.log("User account deleted successfully.");
      }).catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, margin: 'auto', position: 'relative' }}>
      
      {/* Edit Text at the Top Right */}
      <Button
        color="primary"
        onClick={handleEditClick}
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        Edit
      </Button>

      <Grid container spacing={2}>
        {/* Left Side - Profile Picture, Username, Member Since, and Delete Account Button */}
        <Grid item xs={2} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar 
            alt="User Profile" 
            src={profilePictureUrl} 
            sx={{ width: 100, height: 100, marginBottom: 2 }}
          />
          
          {/* Profile Picture Upload Button */}
          {isEditing && (
            <Button
              variant="contained"
              component="label"
              sx={{ marginBottom: 2 }}
            >
              Upload Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleProfilePicChange}
              />
            </Button>
          )}

          {/* Editable Username */}
          {isEditing ? (
            <>
              <Typography variant="body2" color="textSecondary">Username</Typography>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  border: 'none',
                  borderBottom: '1px solid #ccc',
                  outline: 'none',
                  textAlign: 'center',
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                  width: '100%',
                  color: 'black', // Changed color to black
                }}
              />
            </>
          ) : (
            <>
              <Typography variant="body2" color="textSecondary">Username</Typography>
              <Typography variant="h6" sx={{ marginBottom: 1, color: 'black' }}>
                {username}
              </Typography>
            </>
          )}

          {/* User Type Field */}
          <Typography variant="body2" color="textSecondary">User Type</Typography>
          {isEditing ? (
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              style={{
                border: 'none',
                borderBottom: '1px solid #ccc',
                outline: 'none',
                textAlign: 'center',
                fontSize: '1rem',
                marginBottom: '0.5rem',
                width: '100%',
                color: 'black', // Changed color to black
              }}
            >
              <option value="Renter">Renter</option>
              <option value="Landlord">Landlord</option>
            </select>
          ) : (
            <Typography variant="h6" sx={{ marginBottom: 2, color: 'black' }}>
              {userType}
            </Typography>
          )}

          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
            Member since: {memberSince}
          </Typography>

          {/* Delete Account Button */}
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteAccount}
            sx={{ marginTop: 'auto', width: '100%' }}
          >
            Delete Account
          </Button>
        </Grid>

        {/* Divider */}
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

        {/* Right Side - Profile Information */}
        <Grid item xs={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" gutterBottom>
              Profile Details
            </Typography>

            <Box>
              <Typography variant="body2" color="textSecondary">First Name</Typography>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!isEditing}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '8px',
                  width: '100%',
                  marginBottom: '16px',
                  opacity: isEditing ? 1 : 0.7,
                  color: 'black', // Changed color to black
                }}
              />
              
              <Typography variant="body2" color="textSecondary">Last Name</Typography>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!isEditing}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '8px',
                  width: '100%',
                  marginBottom: '16px',
                  opacity: isEditing ? 1 : 0.7,
                  color: 'black', // Changed color to black
                }}
              />
              
              <Typography variant="body2" color="textSecondary">Email</Typography>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '8px',
                  width: '100%',
                  marginBottom: '16px',
                  opacity: isEditing ? 1 : 0.7,
                  color: 'black', // Changed color to black
                }}
              />
              
              <Typography variant="body2" color="textSecondary">Phone</Typography>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '8px',
                  width: '100%',
                  marginBottom: '16px',
                  opacity: isEditing ? 1 : 0.7,
                  color: 'black', // Changed color to black
                }}
              />
              
              <Typography variant="body2" color="textSecondary">City</Typography>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!isEditing}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '8px',
                  width: '100%',
                  marginBottom: '16px',
                  opacity: isEditing ? 1 : 0.7,
                  color: 'black', // Changed color to black
                }}
              />
              
              <Typography variant="body2" color="textSecondary">State</Typography>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                disabled={!isEditing}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '8px',
                  width: '100%',
                  marginBottom: '16px',
                  opacity: isEditing ? 1 : 0.7,
                  color: 'black', // Changed color to black
                }}
              />
            </Box>

            {/* Bio/About Me Section */}
            <Box sx={{ marginTop: 3 }}>
              <Typography variant="h6" gutterBottom>
                About Me
              </Typography>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!isEditing}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '8px',
                  width: '100%',
                  height: '100px',
                  opacity: isEditing ? 1 : 0.7,
                  color: 'black', // Changed color to black
                }}
              />
            </Box>
          </Box>

          {/* Save Button */}
          {isEditing && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSaveClick}
              sx={{ marginTop: 2 }}
            >
              Save
            </Button>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Profile;
