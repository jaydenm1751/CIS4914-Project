import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import SellIcon from '@mui/icons-material/Sell';
import EventIcon from '@mui/icons-material/Event';
import './SubleaseDetails.css';

const SubleaseDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Retrieve the ID from the URL
  const [sublease, setSublease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSublease = async () => {
      try {
        const subleaseRef = doc(db, 'subleases', id); // Reference the document using the ID
        const subleaseSnap = await getDoc(subleaseRef);
        
        if (subleaseSnap.exists()) {
          setSublease(subleaseSnap.data()); // Set the sublease data if the document exists
        } else {
          setError('Sublease not found');
        }
      } catch (error) {
        setError('Error fetching sublease details');
      } finally {
        setLoading(false);
      }
    };

    fetchSublease();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!sublease) {
    return <div>Sublease not found</div>;
  }

  // Destructure the fields
  const { address, rent, numBedrooms, numBathrooms, sqft, imageUrl, leaseTerms, features } = sublease;

  // Convert Firestore Timestamps to JS Date objects, ensuring they exist first
  const earliestMoveInDate = leaseTerms?.earliestMoveInDate?.seconds 
  ? new Date(leaseTerms.earliestMoveInDate.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
  : 'Not specified';

  const earliestMoveOutDate = leaseTerms?.earliestMoveOutDate?.seconds 
  ? new Date(leaseTerms.earliestMoveOutDate.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
  : 'Not specified';

  return (
    <div className="sublease-container">
      <div className="left-column">
        <img src={imageUrl} alt="Sublease" className="apartment-image" />
        <h2>{`${address.street}, ${address.city}, ${address.state} ${address.zip}`}</h2>
        <p>{address.city}, {address.state}</p>

        {/* Image gallery placeholder */}
        <div className="image-gallery">
          <img src={imageUrl} alt="Gallery Image 1" />
          {/* Add more images if needed */}
        </div>

        <h3>The Basics</h3>
        <p><strong>Bedrooms:</strong> {numBedrooms}</p>
        <p><strong>Bathrooms:</strong> {numBathrooms}</p>
        <p><strong>Square Feet:</strong> {sqft} sqft</p>
        <p><strong>Furnished:</strong> {features?.IsFurnished ? 'Yes' : 'No'}</p>
      </div>

      {/* Right Column: Rent, Move-In/Move-Out Details, and Message Form */}
      <div className="right-column">
        <div className="rent-details">
          <p className="sublease-post-rent">
            <SellIcon className="rent-icon" />
            <span className="rent-amount">${rent}</span> <span className="rent-text">per month</span>
          </p>          

          <div className="dates">
            <p>
              <EventIcon className="event-icon" />
              <strong>Earliest Move-In:</strong> {earliestMoveInDate}
            </p>
            <p>
              <EventIcon className="event-icon" />
              <strong>Earliest Move-Out:</strong> {earliestMoveOutDate}
            </p>
          </div>
        </div>

        <div className="message-box">
          <div className="send-a-message-heading">
            <p className="send-a-message">Send a Message</p>
            <p className="to-landlord">To the Landlord who Posted this Listing</p>
          </div>
          <form>
            <label htmlFor="subject"><strong>Subject:</strong></label>
            <input type="text" id="subject" name="subject" value={`${address.street}, ${address.city}`} readOnly />

            <label htmlFor="message"><strong>Message:</strong></label>
            <textarea id="message" name="message" placeholder="Your Message"></textarea>

            <div className="button-container">
              <button type="submit">Send Message</button>
            </div>
          </form>
          <p className="conversation-notice">
            All your conversations can be seen in <span className="messages-link" onClick={() => navigate('/messages')}>Messages</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubleaseDetails;
