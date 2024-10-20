import React, { useState } from 'react';
import { db, storage } from '../../config/firebase'; // Import storage from firebase config
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import storage utilities

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rent, setRent] = useState('');
  const [numBedrooms, setNumBedrooms] = useState('');
  const [numBathrooms, setNumBathrooms] = useState('');
  const [sqft, setSqft] = useState('');
  const [imageFiles, setImageFiles] = useState([]); // For storing the selected file


  // Address fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  // Construct address object
  const address = {
    street,
    city,
    state,
    zip,
  };

  const handleImageUpload = (e) => {
    if (imageFiles.length >= 7) {
      alert("You can only upload up to 7 images.");
      return;
    }
    const files = Array.from(e.target.files);
    setImageFiles((prevFiles) => [...prevFiles, ...files]); // Append new files to the existing ones
  };

  const handleDeleteImage = (index) => {
    setImageFiles((prevFiles)=> prevFiles.filter((_, i) => i !== index));
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const imageUrls = [];
      // Upload each image
      for (let file of imageFiles) {
        const storageRef = ref(storage, `images/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        imageUrls.push(downloadUrl);
      }
      // Add sublease post to Firestore
      const subleaseData = {
        title,
        description,
        rent,
        numBedrooms,
        numBathrooms,
        sqft,
        imageUrls, // Store the image URL from Firebase Storage
        address,
      };

      await addDoc(collection(db, 'subleases'), subleaseData);
      
      // Clear the form after submission
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
      alert("Sublease created successfully!");

    } catch (error) {
      console.error('Error creating sublease:', error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Rent"
        value={rent}
        onChange={(e) => setRent(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Bedrooms"
        value={numBedrooms}
        onChange={(e) => setNumBedrooms(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Bathrooms"
        value={numBathrooms}
        onChange={(e) => setNumBathrooms(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Square Feet"
        value={sqft}
        onChange={(e) => setSqft(e.target.value)}
        required
      />

      {/* Address fields */}
      <input
        type="text"
        placeholder="Street"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="State"
        value={state}
        onChange={(e) => setState(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="ZIP"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        required
      />

      {/* File input */}
      <input type="file" accept="image/*" multiple onChange={handleImageUpload} required />
      <button type="submit">Create Post</button>
      <div className="image-preview">
      {imageFiles.map((file, index) => (
        <div key={index} style={{ display: "inline-block", position: "relative" }}>
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            style={{ width: "100px", height: "100px", marginRight: "10px" }}
          />
          <button
            type="button"
            onClick={() => handleDeleteImage(index)}
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              cursor: "pointer",
            }}
          >
            X
          </button>
        </div>
      ))}
    </div>

    </form>
  );
};

export default CreatePost;
