import React, { useState, useEffect } from 'react';
import HomeHeader from './HomeHeader';
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

    return (
        <div className="home-container">
            <HomeHeader />

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
        </div>
    );
};

export default Home;
