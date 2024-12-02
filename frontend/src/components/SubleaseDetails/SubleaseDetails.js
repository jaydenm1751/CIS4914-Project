import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useParams, useNavigate } from 'react-router-dom';
// import { doc, getDoc } from 'firebase/firestore';
import { collection, addDoc, getDoc, query, where, doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebase';
import SellIcon from '@mui/icons-material/Sell';
import EventIcon from '@mui/icons-material/Event';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import Slider from 'react-slick'; // Import the Slider component from react-slick
import 'slick-carousel/slick/slick.css'; // Import the slick styles
import 'slick-carousel/slick/slick-theme.css'; // Import the slick theme
import './SubleaseDetails.css';
import { Chair } from '@mui/icons-material';
import MapContainer from './../MapContainer/MapContainer';

const SubleaseDetails = () => {

  const navigate = useNavigate();
  const { id } = useParams(); // Retrieve the ID from the URL
  const [sublease, setSublease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [latLng, setLatLng] = useState({ lat: null, lng: null });
  const [inputMessage, setInputMessage] = useState('');
  const { user } = useContext(UserContext);


  useEffect(() => {
    const fetchSublease = async () => {
      try {
        const subleaseRef = doc(db, 'subleases', id); // Reference the document using the ID
        const subleaseSnap = await getDoc(subleaseRef);
        
        if (subleaseSnap.exists()) {
          const subleaseData = subleaseSnap.data();
          setSublease(subleaseData); // Set the sublease data if the document exists
          // If lat and lng are not in the sublease data, geocode the address
          if (!subleaseData.address.lat || !subleaseData.address.lng) {
            await geocodeAddress(subleaseData.address);
          } else {
            setLatLng({
              lat: subleaseData.address.lat,
              lng: subleaseData.address.lng,
            });
          }
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

  // Function to geocode address using Google Maps Geocoding API
  const geocodeAddress = async (address) => {
    const formattedAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(formattedAddress)}&key=AIzaSyDnSV7ev8TKKTTzC8moLgAFBLF94dZ13Ls`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setLatLng({ lat: location.lat, lng: location.lng });
      } else {
        console.error('No results found for the address.');
      }
    } catch (error) {
      console.error('Error with geocoding:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!sublease) {
    return <div>Sublease not found</div>;
  }

  if (!latLng.lat || !latLng.lng) {
    return <div>No location available for this sublease.</div>;
  }
  

  // Destructure the fields
  const { address, rent, numBedrooms, numBathrooms, sqft, imageUrls, leaseTerms, features, description, userID } = sublease;

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

  //subleaseDetails.js sendMessage
  const handleSendMessage = async (e) => {
    console.log("logged in user id: ", user.uid);
    e.preventDefault();

    console.log("Current user:", user); 
    console.log("Current user ID:", user?.uid); 
    console.log("Sublease data:", sublease);
    console.log("Sublease owner ID:", sublease?.userID);

    // Explicitly check for null or undefined for both user and sublease.userId
    if (user?.uid == null || sublease?.userID == null) {
      console.error("User or sublease owner ID is missing.");
      return;
    }

    if (inputMessage.trim() === '') {
      console.error("Message content is empty.");
      return;
    }

    if (inputMessage.trim() === '') return;
  
    try {
      const senderId = user.uid;
      const receiverId = sublease.userID; // Assuming `sublease` contains userId of the post owner
      const senderConversationPath = `users/${senderId}/conversations/${receiverId}`;
      const timestamp = new Date();

      const receiverConversationPath = `users/${receiverId}/conversations/${senderId}`;
      const receiverConversationRef = doc(db, receiverConversationPath);
      
      console.log("Conversation path: ", senderConversationPath);
     
      const senderConversationRef = doc(db, senderConversationPath);
      const newMessage = {
        text: inputMessage,
        senderId,
        receiverId,
        timestamp,
      };
  
      // Check if conversation exists, if not, create it
      // Update both conversations
      await Promise.all([
        updateDoc(senderConversationRef, {
          messages: arrayUnion(newMessage),
          participants: [senderId, receiverId],
        }).catch(async (error) => {
          // If the sender's conversation doesn't exist, create it
          if (error.code === 'not-found') {
            await setDoc(senderConversationRef, {
              messages: [newMessage],
              participants: [senderId, receiverId],
            });
          } else {
            throw error;
          }
        }),

        updateDoc(receiverConversationRef, {
          messages: arrayUnion(newMessage),
          participants: [receiverId, senderId],
        }).catch(async (error) => {
          // If the receiver's conversation doesn't exist, create it
          if (error.code === 'not-found') {
            await setDoc(receiverConversationRef, {
              messages: [newMessage],
              participants: [receiverId, senderId],
            });
          } else {
            throw error;
          }
        }),
      ]);

  
      setInputMessage(''); // Clear the input
      alert('Message sent successfully!');
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
  const earliestMoveInDate = leaseTerms?.earliestMoveInDate
  ? leaseTerms.earliestMoveInDate 
    ? new Date(leaseTerms.earliestMoveInDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
    : 'Not specified'
  : 'Not specified';

const earliestMoveOutDate = leaseTerms?.earliestMoveOutDate
  ? leaseTerms.earliestMoveOutDate 
    ? new Date(leaseTerms.earliestMoveOutDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
    : 'Not specified'
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

        <p className="bed-bath-sqft">
          <BedIcon className="event-icon" />
          <strong>Bedrooms:</strong> {numBedrooms}
        </p>
        <p className="bed-bath-sqft">
          <BathtubIcon className="event-icon" />
          <strong>Bathrooms:</strong> {numBathrooms}
        </p>
        <p className="bed-bath-sqft">
          <SquareFootIcon className="event-icon" />
          <strong>Square Feet:</strong> {sqft}
        </p>

        <h2 className="address-header"> Features</h2>
        <p>{featureList || 'No features available'}</p>

        <h2 className="address-header"> Property Details</h2>
        <p>{description}</p>
        <MapContainer lat={latLng.lat} lng={latLng.lng} />
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
          <form onSubmit={handleSendMessage}>
            <label htmlFor="subject"><strong>Subject:</strong></label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={`${address.street}, ${address.city}`}
              readOnly
            />

            <label htmlFor="message"><strong>Message:</strong></label>
            <textarea
              id="message"
              name="message"
              placeholder="Your Message"
              value={inputMessage} // Bind to `inputMessage` state
              onChange={(e) => setInputMessage(e.target.value)} // Update `inputMessage` on change
            />

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
