import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import './SubleaseDetails.css';

const SubleaseDetails = () => {
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

  const { address, rent, numBedrooms, numBathrooms, sqft, imageUrl } = sublease;

  return (
    <div className="sublease-details">
      <img src={imageUrl} alt="Sublease" className="sublease-details-image" />
      <h3>{`${address.street}, ${address.city}, ${address.state} ${address.zip}`}</h3>
      <p><strong>Rent:</strong> ${rent} per month</p>
      <p><strong>Bedrooms:</strong> {numBedrooms}</p>
      <p><strong>Bathrooms:</strong> {numBathrooms}</p>
      <p><strong>Square Feet:</strong> {sqft} sqft</p>
    </div>
  );
};

export default SubleaseDetails;
