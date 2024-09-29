import React from 'react';
import './Home.css';
import SubleasePost from './SubleasePost';

const Home = () => {
  const subleasePosts = [
    {
      id: 1,
      address: {
        street: '123 Main St',
        city: 'City Name',
        state: 'State Name',
        zip: '12345',
      },
      rent: '1200',
      numBedrooms: 2,
      numBathrooms: 1,
      sqft: 1200,
      imageUrl: 'https://6a01ca860c8935adfb1b-1300c413ab02c605618555e5f9930152.ssl.cf2.rackcdn.com/uploads/PropertyPhotosModel/3/9/6/1/9/7/3/3961973/image/416bc9ab43034e1e775501d5f8b18a70.large.png',
    },
    {
      id: 2,
      address: {
        street: '456 University Ave',
        city: 'City Name',
        state: 'State Name',
        zip: '67890',
      },
      rent: '800',
      numBedrooms: 1,
      numBathrooms: 1,
      sqft: 850,
      imageUrl: 'https://www.leasebreak.com/uploads/PropertyInfoModel/3/5/0/8/3/8/350838/image/20b385d2faccd9adc26abe4f68287a9d.featured.png',
    },
    {
      id: 3,
      address: {
        street: '789 Broadway St',
        city: 'City Name',
        state: 'State Name',
        zip: '11223',
      },
      rent: '1500',
      numBedrooms: 3,
      numBathrooms: 2,
      sqft: 1800,
      imageUrl: 'https://6a01ca860c8935adfb1b-1300c413ab02c605618555e5f9930152.ssl.cf2.rackcdn.com/uploads/PropertyPhotosModel/3/9/6/3/8/8/3/3963883/image/72f3b00234b5f6553ee9d8e7ee031cbe.large.jpeg',
    },
    {
      id: 4,
      address: {
        street: '1010 Sunset Blvd',
        city: 'City Name',
        state: 'State Name',
        zip: '54321',
      },
      rent: '1000',
      numBedrooms: 2,
      numBathrooms: 2,
      sqft: 1400,
      imageUrl: 'https://6a01ca860c8935adfb1b-1300c413ab02c605618555e5f9930152.ssl.cf2.rackcdn.com/uploads/PropertyPhotosModel/3/9/6/5/6/2/9/3965629/image/f892934f0cae77f0a0caabfb473f785e.middle.png',
    },
    {
      id: 5,
      address: {
        street: '2020 Ocean Drive',
        city: 'City Name',
        state: 'State Name',
        zip: '98765',
      },
      rent: '2500',
      numBedrooms: 4,
      numBathrooms: 3,
      sqft: 1876,
      imageUrl: 'https://6a01ca860c8935adfb1b-1300c413ab02c605618555e5f9930152.ssl.cf2.rackcdn.com/uploads/PropertyPhotosModel/3/9/6/5/6/2/7/3965627/image/a516e3b6b41017448833cf129df7d2f2.middle.png',
    },
  ];

  return (
    <div className="home-container">
      <div className="post-list">
        {subleasePosts.map((post) => (
          <SubleasePost
            key={post.id}
            id={post.id}
            address={post.address}
            rent={post.rent}
            numBedrooms={post.numBedrooms}
            numBathrooms={post.numBathrooms}
            sqft={post.sqft}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
