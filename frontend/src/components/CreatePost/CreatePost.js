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
  const [imageFile, setImageFile] = useState(null); // For storing the selected file

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

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Grab the first file selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = '';
      if (imageFile) {
        // Upload image to Firebase Storage
        const imageRef = ref(storage, `images/${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref); // Get the download URL
      }

      // Add sublease post to Firestore
      const subleaseData = {
        title,
        description,
        rent,
        numBedrooms,
        numBathrooms,
        sqft,
        imageUrl, // Store the image URL from Firebase Storage
        address,
      };

      await addDoc(collection(db, 'subleases'), subleaseData);
      console.log('Sublease added successfully!');
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
      <input type="file" accept="image/*" onChange={handleImageChange} required />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePost;
