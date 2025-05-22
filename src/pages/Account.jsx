import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import {
    getCurrentUser,
    updateUser,
    fetchUserCourses,
    fetchEnrolledCourses
} from '../services/api';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const Account = () => {
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState('/default-profile.png');
    const [activeTab, setActiveTab] = useState('details');
    const [createdCourses, setCreatedCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        let imageUrl;

        const fetchUserAndImage = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);

                const cookie = Cookies.get('user');
                if (cookie) {
                    const parsed = JSON.parse(cookie);
                    const res = await fetch(`http://localhost:8080/api/users/${userData.id}/profile-image`, {
                        headers: {
                            Authorization: `Bearer ${parsed.token}`
                        }
                    });

                    if (res.ok) {
                        const blob = await res.blob();
                        imageUrl = URL.createObjectURL(blob);
                        setPreview(imageUrl);
                    } else {
                        console.warn("Image fetch failed:", res.status);
                    }
                }
            } catch (err) {
                console.error("Failed to load user or image", err);
            }
        };

        fetchUserAndImage();
        fetchUserCourses(id).then(setCreatedCourses).catch(console.error);
        fetchEnrolledCourses(id).then(setEnrolledCourses).catch(console.error);

        return () => {
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreview(URL.createObjectURL(file));
        }
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

    const navigate = useNavigate();

const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
        Cookies.remove('user');
        navigate('/login');
    }
};


    if (!user) return <p className="account-loading">Loading...</p>;

    return (
        <>
            <Navbar />
            <div className="account-wrapper">
                <div className="account-sidebar">
                    <img src={preview} alt="Profile" className="account-image" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <div className="tabs">
                        <button onClick={() => setActiveTab('details')} className={activeTab === 'details' ? 'active' : ''}>Account Details</button>
                        {user.role === 'TEACHER' && (
                            <button onClick={() => setActiveTab('created')} className={activeTab === 'created' ? 'active' : ''}>Courses Created</button>
                        )}
                        <button onClick={() => setActiveTab('enrolled')} className={activeTab === 'enrolled' ? 'active' : ''}>Enrolled Courses</button>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
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
                    {user.role === 'TEACHER' && activeTab === 'created' && (
                        <div className="account-courses">
                            <div className="account-courses-header">
                                <h2>Courses You Created</h2>
                                <button onClick={() => navigate('/createcourse')} className="create-course-button">
                                    + Create New Course
                                </button>
                            </div>
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
