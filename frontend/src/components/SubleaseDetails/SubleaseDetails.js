import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import SellIcon from '@mui/icons-material/Sell';
import EventIcon from '@mui/icons-material/Event';
import Slider from 'react-slick'; // Import the Slider component from react-slick
import 'slick-carousel/slick/slick.css'; // Import the slick styles
import 'slick-carousel/slick/slick-theme.css'; // Import the slick theme
import './SubleaseDetails.css';

const SubleaseDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Retrieve the ID from the URL
  const [sublease, setSublease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

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
  const { address, rent, numBedrooms, numBathrooms, sqft, imageUrls, leaseTerms, features, description } = sublease;

  // Create feature list to be displayed in features section
  const featureList = [
    features?.hasAC && 'AC Included',
    features?.isPetFriendly && 'Pet Friendly',
    features?.utilitiesAreIncluded && 'Utilities Included',
    features?.hasParking && 'Parking Available',
    features?.isFurnished && 'Furnished',
    features?.hasLaundry && 'Laundry Included'
  ]
    .filter(Boolean)
    .join(' · ');

  // Settings for gallery slide feature
  const settings = {
    asNavFor: nav2,
    ref: (slider) => setNav1(slider),
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: (
      <div>
        <div className="next-slick-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" stroke="black" height="24" viewBox="0 -960 960 960" width="24"><path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z"/></svg>
        </div>
      </div>
    ),
    prevArrow: (
      <div>
        <div className="next-slick-arrow rotate-180">
          <svg xmlns="http://www.w3.org/2000/svg" stroke="black" height="24" viewBox="0 -960 960 960" width="24"><path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z"/></svg>
        </div>
      </div>
    ),
  };

  // Thumbnail slider settings
  const thumbnailSliderSettings = {
    asNavFor: nav1,
    ref: (slider) => setNav2(slider),
    slidesToShow: 4,
    swipeToSlide: true,
    focusOnSelect: true,
    centerMode: true,
  };

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
        <Slider {...settings} className="slider">
          {imageUrls.map((url, index) => (
            <div key={index}>
              <img src={url} alt={`Image ${index + 1}`} className="apartment-image" />
            </div>
          ))}
        </Slider>
        <Slider {...thumbnailSliderSettings} className="thumbnail-slider">
          {imageUrls.map((url, index) => (
            <div key={index} className="thumbnail">
              <img src={url} alt={`Thumbnail ${index + 1}`} className="thumbnail-image" />
            </div>
          ))}
        </Slider>
        <h2 className="address-header">{`${address.street}, ${address.city}, ${address.state} ${address.zip}`}</h2>

        <p><strong>Bedrooms:</strong> {numBedrooms}</p>
        <p><strong>Bathrooms:</strong> {numBathrooms}</p>
        <p><strong>Square Feet:</strong> {sqft} sqft</p>
        <p><strong>Furnished:</strong> {features?.IsFurnished ? 'Yes' : 'No'}</p>

        <h2 className="address-header"> Features</h2>
        <p>{featureList || 'No features available'}</p>

        <h2 className="address-header"> Property Details</h2>
        <p>{description}</p>

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
