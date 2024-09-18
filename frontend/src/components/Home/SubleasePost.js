import React from 'react';
import './SubleasePost.css';

const SubleasePost = ({ title, rent, description, location }) => {
  return (
    <div className="post">
      <h3>{title}</h3>
      <p>{rent}</p>
      <p>{description}</p>
      <p>{location}</p>
    </div>
  );
};

export default SubleasePost;
