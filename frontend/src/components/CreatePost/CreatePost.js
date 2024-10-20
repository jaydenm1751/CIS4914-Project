import React, { useState } from 'react';
import { db, storage } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';
import backArrow from '../../assets/images/backArrow.png';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rent, setRent] = useState('');
  const [numBedrooms, setNumBedrooms] = useState('');
  const [numBathrooms, setNumBathrooms] = useState('');
  const [sqft, setSqft] = useState('');
  const [imageFiles, setImageFiles] = useState([]); // For storing the selected files

  // Address fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const navigate = useNavigate();

  // Handle image upload and update state
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Filter valid image files
    const validFiles = files.filter((file) => file.type.startsWith('image/'));

    // Limit to 7 images
    if (validFiles.length + imageFiles.length > 7) {
      alert('You can only upload up to 7 images.');
      return;
    }

    setImageFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  // Delete an image from the preview list
  const handleDeleteImage = (index) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const imageUrls = [];

      // Upload each image and get the download URL
      for (let file of imageFiles) {
        const storageRef = ref(storage, `images/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        imageUrls.push(downloadUrl);
      }

      // Prepare sublease post data
      const subleaseData = {
        title,
        description,
        rent,
        numBedrooms,
        numBathrooms,
        sqft,
        imageUrls, // Store the image URLs from Firebase Storage
        address: { street, city, state, zip },
      };

      // Add sublease post to Firestore
      await addDoc(collection(db, 'subleases'), subleaseData);

      // Clear form after submission
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
      alert('Sublease created successfully!');

      // Navigate to the homepage
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
            <h2>Create a Post</h2>

            {/* Title Section */}
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

            {/* Description Section */}
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

            {/* Image Upload Section */}
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
                  style={{ display: 'none' }} // Hide the actual file input
                />
              </div>
            </section>

            {/* Image Preview Section */}
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

            {/* Rent, Bedrooms, Bathrooms, and Square Feet Section */}
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

            {/* Address Section */}
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

            <button type="submit" className="submit-button">
              Create Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
