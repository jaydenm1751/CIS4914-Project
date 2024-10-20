import React, { useState } from 'react';
import { db, storage } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './CreatePost.css'; // Import the CSS file for styles
import backArrow from '../../assets/images/backArrow.png';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rent, setRent] = useState('');
  const [numBedrooms, setNumBedrooms] = useState('');
  const [numBathrooms, setNumBathrooms] = useState('');
  const [sqft, setSqft] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  // Address fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // Create a local URL for the uploaded image
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url); // Set the image preview URL
    } else {
      setImagePreview(null); // Clear preview if no file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = '';
      if (imageFile) {
        const imageRef = ref(storage, `images/${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const subleaseData = {
        title,
        description,
        rent,
        numBedrooms,
        numBathrooms,
        sqft,
        imageUrl,
        address: { street, city, state, zip },
      };

      await addDoc(collection(db, 'subleases'), subleaseData);
      console.log('Sublease added successfully!');
      
      // Navigate to homepage
      navigate('/'); // Change to the homepage route
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
            <h2>Create a Post</h2>

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
                  Choose File to Upload
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  style={{ display: 'none' }} // Hide the actual file input
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>
            </section>

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
                <label>ZIP</label>
                <input
                  type="text"
                  placeholder="ZIP"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  required
                />
              </div>
            </section>

            <button type="submit" className="submit-button">Create Post</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
