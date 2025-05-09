import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getCurrentUser, updateUser, fetchUserCourses } from '../services/api';
import { useParams } from 'react-router-dom';

const Account = () => {
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState('/default-profile.png');
    const [activeTab, setActiveTab] = useState('details');
    const [createdCourses, setCreatedCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        getCurrentUser(id)
            .then(data => {
                setUser(data);
                if (data.profileImage) {
                    setPreview(`data:image/jpeg;base64,${btoa(
                        new Uint8Array(data.profileImage.data).reduce((s, b) => s + String.fromCharCode(b), '')
                    )}`);
                }
            })
            .catch(err => console.error("Failed to load user", err));

        fetchUserCourses(id).then(setCreatedCourses).catch(console.error);
        // Optional: fetchEnrolledCourses(id).then(setEnrolledCourses)
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(user.id, user, profileImage);
            alert("Profile updated!");
        } catch (error) {
            console.error("Update failed:", error);
            alert("Something went wrong");
        }
    };

    if (!user) return <p className="account-loading">Loading...</p>;

    return (
        <>
            <Navbar />
            <div className="account-wrapper">
                <div className="account-sidebar">
                    <img src={preview} alt="Profile" className="account-image" />
                    <input type="file" onChange={handleImageChange} />
                    <div className="tabs">
                        <button onClick={() => setActiveTab('details')} className={activeTab === 'details' ? 'active' : ''}>Account Details</button>
                        <button onClick={() => setActiveTab('created')} className={activeTab === 'created' ? 'active' : ''}>Courses Created</button>
                        <button onClick={() => setActiveTab('enrolled')} className={activeTab === 'enrolled' ? 'active' : ''}>Enrolled Courses</button>
                    </div>
                </div>
                <div className="account-main">
                    {activeTab === 'details' && (
                        <form onSubmit={handleSubmit} className="account-form">
                            <label>Username</label>
                            <input type="text" name="username" value={user.username || ''} onChange={handleInputChange} />
                            <label>First Name</label>
                            <input type="text" name="firstName" value={user.firstName || ''} onChange={handleInputChange} />
                            <label>Last Name</label>
                            <input type="text" name="lastName" value={user.lastName || ''} onChange={handleInputChange} />
                            <label>Bio</label>
                            <textarea name="bio" value={user.bio || ''} onChange={handleInputChange} />
                            <button type="submit">Save Changes</button>
                        </form>
                    )}
                    {activeTab === 'created' && (
                        <div className="account-courses">
                            <h2>Courses You Created</h2>
                            {createdCourses.length === 0 ? (
                                <p>No created courses yet.</p>
                            ) : (
                                <ul>
                                    {createdCourses.map(course => (
                                        <li key={course.id}>{course.title}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                    {activeTab === 'enrolled' && (
                        <div className="account-courses">
                            <h2>Enrolled Courses</h2>
                            {enrolledCourses.length === 0 ? (
                                <p>No enrolled courses yet.</p>
                            ) : (
                                <ul>
                                    {enrolledCourses.map(course => (
                                        <li key={course.id}>{course.title}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Account;
