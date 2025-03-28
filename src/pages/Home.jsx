import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <>
            <Navbar />
            <div className="container">
                <h1>Welcome to UpliftEd</h1>
                <p>Your platform for accessing quality educational courses.</p>
            </div>
        </>
    );
};

export default Home;
