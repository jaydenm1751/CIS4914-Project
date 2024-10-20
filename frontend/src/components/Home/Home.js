import React, { useState, useEffect } from 'react';
import './Home.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import SubleasePost from './SubleasePost';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [subleasePosts, setSubleasePosts] = useState([]);
    const navigate = useNavigate(); // for navigation

    useEffect(() => {
        const fetchSubleasePosts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'subleases'));
                const posts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSubleasePosts(posts);
            } catch (error) {
                console.error('Error fetching sublease posts: ', error);
            }
        };
        fetchSubleasePosts();
    }, []);

    // Function to handle button click
    const handleCreatePostClick = () => {
        navigate('/createpost'); // Navigate to Create Post page
    };

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
                        imageUrl={post.imageUrls}
                    />
                ))}
            </div>

            {/* Create Post Button */}
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <button
                    onClick={handleCreatePostClick}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#007bff', // Blue background
                        color: 'white', // White text
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px',
                    }}
                >
                    Create Post
                </button>
            </div>
        </div>
    );
};

export default Home;
