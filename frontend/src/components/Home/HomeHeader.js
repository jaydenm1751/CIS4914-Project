import React from 'react';
import './HomeHeader.css';
import FireIcon from '@mui/icons-material/Whatshot';

const HomeHeader = () => {
    return (
        <div className="header-container">
            <h1 className="header-title">SHORTER LEASES, MORE FLEXIBILITY.</h1>
            <p className="header-description">
                The <span className="header-highlight">FREE Marketplace</span> to find and list:
                <span className="header-italic"> short-term rentals, sublets, monthly rentals, rooms for rent, </span>
                and of course, <span className="header-italic">leasebreaks</span>.
            </p>

            <FireIcon className="fire-icon" />
            <div className="most-views-container">
                <p className="most-views-text">View Some Popular Subleases Below</p>
            </div>
        </div>
    );
};

export default HomeHeader;
