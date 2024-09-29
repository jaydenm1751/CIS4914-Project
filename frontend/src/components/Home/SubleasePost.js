import React from 'react';
import './SubleasePost.css';

const SubleasePost = ({ address, rent, imageUrl }) => {
  return (
    <div className="post">
      <img src={imageUrl} alt="Sublease" className="post-image" />
      <h3>{`${address.street}, ${address.city}, ${address.state} ${address.zip}`}</h3>
      <p>Rent: {rent}</p>
    </div>
  );
};

export default SubleasePost;
