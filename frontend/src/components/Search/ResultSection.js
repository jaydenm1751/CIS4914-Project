import React from 'react';

const ResultsSection = ({ results }) => {
  return (
    <div>
      {results.length === 0 ? (
        <p>No results found</p>
      ) : (
        <div>
            <p> {results.length} results </p>
            {results.map((listing) => (
            <div key={listing.id}>
                <h3>{listing.rent}</h3>
                <p>{listing.id}</p>
                <p>{listing.sqft}</p>
            </div>
            ))}
        </ div>
      )}
    </div>
  );
};

export default ResultsSection;
