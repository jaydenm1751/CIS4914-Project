import React, { useState } from 'react';
import './CreatePost.css'; // Custom CSS file for styling
import { db } from "../../config/firebase";
import { collection, addDoc } from 'firebase/firestore';

function CreatePost() {
  // State hooks to manage form fields
  const [title, setTitle] = useState("");
  const [rent, setRent] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  // Handle file input change
  // const handlePhotoChange = (e) => {
  //   setPhoto(e.target.files[0]);
  // };

  // Handle form submission
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "posts"), {
        title: title,
        rent: rent,
        description: description,
        location: location,
        createdAt: new Date(),
      })
      console.log("Post added Successfully");
      //Clears form after creation
      setTitle("");
      setRent("");
      setDescription("");
      setLocation("");

    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create a Sublease Post</h2>
      <form onSubmit={handleCreatePost}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input
          type="text"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          placeholder="Rent"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          required
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
