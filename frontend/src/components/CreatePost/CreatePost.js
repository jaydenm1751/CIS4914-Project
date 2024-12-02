import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { db, storage } from '../../config/firebase';
import { collection, addDoc, getDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import './CreatePost.css';
import backArrow from '../../assets/images/backArrow.png';

const GOOGLE_API_KEY = 'AIzaSyDnSV7ev8TKKTTzC8moLgAFBLF94dZ13Ls';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rent, setRent] = useState('');
  const [numBedrooms, setNumBedrooms] = useState('');
  const [numBathrooms, setNumBathrooms] = useState('');
  const [sqft, setSqft] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const { user, loading } = useContext(UserContext);

  //edit functionality
  const { subleaseId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubleaseId, setCurrentSubleaseId] = useState('');


  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  // New fields
  const [moveInDate, setMoveInDate] = useState('');
  const [moveOutDate, setMoveOutDate] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    console.log('useEffect called.');
    const fetchSublease = async () => {
      console.log('fetchSublease called.');
      if (subleaseId) {
        setIsEditing(true); // Indicate we are in editing mode
        setCurrentSubleaseId(subleaseId);
        try {
          const subleaseRef = doc(db, 'subleases', subleaseId);
          const subleaseSnap = await getDoc(subleaseRef);
          if (subleaseSnap.exists()) {
            const subleaseData = subleaseSnap.data();
            console.log("fetched Sublease data:", subleaseData);
            setTitle(subleaseData.title || '');
            setDescription(subleaseData.description || '');
            setRent(subleaseData.rent || '');
            setNumBedrooms(subleaseData.numBedrooms || '');
            setNumBathrooms(subleaseData.numBathrooms || '');
            setSqft(subleaseData.sqft || '');
            setStreet(subleaseData.address?.street || '');
            setCity(subleaseData.address?.city || '');
            setState(subleaseData.address?.state || '');
            setZip(subleaseData.address?.zip || '');
            setImageFiles([]); // Do not set image files directly, they need to be re-uploaded
          }
        } catch (error) {
          console.error("Error fetching sublease data:", error);
        }
      }
    };
    if (!loading && user) {
      fetchSublease();
    } else if (!loading && !user) {
        console.log('User is not logged in. Redirecting to login...');
        navigate('/login?redirect=/create-post');
    }
  }, [user, loading, navigate, subleaseId]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.type.startsWith('image/'));
    if (validFiles.length + imageFiles.length > 7) {
      alert('You can only upload up to 7 images.');
      return;
    }
    setImageFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const handleDeleteImage = (index) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };



  const validateAddress = async () => {
    if (!street || !city || !state || !zip) {
      alert("Please complete all address fields.");
      return false;
    }

    const fullAddress = `${street}, ${city}, ${state} ${zip}`;
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${GOOGLE_API_KEY}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        return true;
      } else {
        alert("Please enter a valid address.");
        return false;
      }
    } catch (error) {
      console.error("Error validating address:", error);
      alert("An error occurred while validating the address. Please try again.");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFiles.length < 2) {
      alert("Please upload at least two images to create a post.");
      return;
    }

    const numericFields = { rent, sqft, numBedrooms, numBathrooms };
    for (const [fieldName, value] of Object.entries(numericFields)) {
      if (isNaN(value) || value <= 0) {
        alert(`${fieldName} must be a positive number.`);
        return;
      }
    }

    if (!await validateAddress()) {
      return;
    }

    try {
      const imageUrls = [];
      for (let file of imageFiles) {
        const storageRef = ref(storage, `images/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        imageUrls.push(downloadUrl);
      }

      const subleaseData = {
        title,
        description,
        rent: Number(rent),
        numBedrooms: Number(numBedrooms),
        numBathrooms: Number(numBathrooms),
        sqft: Number(sqft),
        imageUrls,
        address: { street, city, state, zip },
        leaseTerms: {
          earliestMoveInDate: moveInDate,
          earliestMoveOutDate: moveOutDate,
        },
        userID: user.uid,
      };
      
      if (isEditing) {
        console.log('Editing Mode.');
        // Update existing sublease
        const subleaseRef = doc(db, 'subleases', subleaseId);
        await updateDoc(subleaseRef, subleaseData);
        alert('Sublease updated successfully!');
      } else {
        const subleaseRef = await addDoc(collection(db, 'subleases'), subleaseData);

        await updateDoc(subleaseRef, { id: subleaseRef.id });
        // Reset form
        setTitle('');
        setDescription('');
        setRent('');
        setNumBedrooms('');
        setNumBathrooms('');
        setSqft('');
        setStreet('');
        setCity('');
        setState('');
        setZip('');
        setImageFiles([]);
        setMoveInDate('');
        setMoveOutDate('');
        alert('Sublease created successfully!');
      }

      navigate('/');
    } catch (error) {
      console.error('Error creating sublease:', error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="background">
        <div className="create-post-container">
          <button onClick={() => navigate('/')} className="home-button">
            <img src={backArrow} alt="Home" />
          </button>

          <form onSubmit={handleSubmit} className="create-post-form">
            <h2>{isEditing ? 'Edit Your Sublease' : 'Create a New Sublease'}</h2>

            {/* Other Fields */}
            <section className="form-inline">
              <div className="form-group title">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </section>

            <section className="form-inline">
              <div className="form-group description">
                <label>Description</label>
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </section>

            <section className="form-inline">
              <div className="form-group file-upload">
                <label htmlFor="file-upload" className="file-upload-label">
                  Upload Images
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </section>

            <div className="image-preview-container">
              {imageFiles.map((file, index) => (
                <div key={index} className="image-preview-wrapper">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="delete-image-button"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <section className="form-inline">
              <div className="form-group rent-bedroom">
                <label>Rent</label>
                <input
                  type="number"
                  placeholder="Rent"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                  required
                />
              </div>
              <div className="form-group rent-bedroom">
                <label>Bedrooms</label>
                <input
                  type="number"
                  placeholder="Bedrooms"
                  value={numBedrooms}
                  onChange={(e) => setNumBedrooms(e.target.value)}
                  required
                />
              </div>
            </section>

            <section className="form-inline">
              <div className="form-group bathroom-sqft">
                <label>Bathrooms</label>
                <input
                  type="number"
                  placeholder="Bathrooms"
                  value={numBathrooms}
                  onChange={(e) => setNumBathrooms(e.target.value)}
                  required
                />
              </div>
              <div className="form-group bathroom-sqft">
                <label>Square Feet</label>
                <input
                  type="number"
                  placeholder="Square Feet"
                  value={sqft}
                  onChange={(e) => setSqft(e.target.value)}
                  required
                />
              </div>
            </section>

            <section className="form-inline">
              <div className="form-group street-city">
                <label>Street</label>
                <input
                  type="text"
                  placeholder="Street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </div>
              <div className="form-group street-city">
                <label>City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            </section>

            <section className="form-inline">
              <div className="form-group state-zip">
                <label>State</label>
                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
              <div className="form-group state-zip">
                <label>Zip</label>
                <input
                  type="text"
                  placeholder="Zip"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  required
                />
              </div>
            </section>

            
            <section className="form-inline">
              <div className="form-group move-in-out-date">
                <label>Move-In Date</label>
                <input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group move-in-out-date">
                <label>Move-Out Date</label>
                <input
                  type="date"
                  value={moveOutDate}
                  onChange={(e) => setMoveOutDate(e.target.value)}
                  required
                />
              </div>
            </section>

            <button type="submit" className="submit-button">
              {isEditing ? 'Update Post' : 'Create Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
