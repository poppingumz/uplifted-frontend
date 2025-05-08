import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';

const Home = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const cookieData = Cookies.get('user');
        if (cookieData) {
            setUser(JSON.parse(cookieData));
        }
    }, []);

    return (
        <>
            <Navbar />
            <div className="home-container">
                {user ? (
                    <h2>Welcome, {user?.user?.firstName || user?.user?.username || user?.user?.email}!</h2>
                ) : (
                    <h2>Welcome! Please log in or register.</h2>
                )}
            </div>
        </>
    );
};

export default Home;
