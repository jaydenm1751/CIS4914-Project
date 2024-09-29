import React, { useState } from 'react';
import './CreatePost.css'; // Custom CSS file for styling

function CreatePost() {
  // State hooks to manage form fields
  const [monthlyRent, setMonthlyRent] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [photo, setPhoto] = useState(null);

  // Handle file input change
  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      monthlyRent,
      address,
      phone,
      startDate,
      endDate,
      photo,
    };
    console.log('Form Data Submitted: ', formData);
    // Here, you would normally send formData to your backend server
  };

  return (
    <div className="create-post-container">
      <h2>Create a Sublease Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        {/* Monthly Rent Input */}
        <label>
          Monthly Rent ($):
          <input
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
            required
            placeholder="e.g., 1200"
          />
        </label>

        {/* Address Input */}
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="e.g., 123 Main St, City, State"
          />
        </label>

        {/* Phone Number Input */}
        <label>
          Phone Number:
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="e.g., (123) 456-7890"
          />
        </label>

        {/* Lease Start and End Date Inputs */}
        <label>
          Lease Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>

        <label>
          Lease End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>

        {/* Upload Photo Input */}
        <label>
          Upload Photo:
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </label>

        {/* Submit Button */}
        <button type="submit">Submit Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
