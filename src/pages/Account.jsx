import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getCurrentUser, updateUser } from '../services/api';

const Account = () => {
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        getCurrentUser()
            .then(data => setUser(data))
            .catch(err => console.error("Failed to load user", err));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleImageChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateUser(user.id, user, profileImage);
        alert("Profile updated!");
    };

    if (!user) return <p>Loading...</p>;

    return (
        <>
            <Navbar />
            <div className="account-container">
                <h1>My Account</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" value={user.username} onChange={handleInputChange} />
                    <input type="text" name="firstName" value={user.firstName || ''} onChange={handleInputChange} />
                    <input type="text" name="lastName" value={user.lastName || ''} onChange={handleInputChange} />
                    <textarea name="bio" value={user.bio || ''} onChange={handleInputChange} />
                    <input type="file" onChange={handleImageChange} />
                    <button type="submit">Save Changes</button>
                </form>
            </div>
        </>
    );
};

export default Account;
