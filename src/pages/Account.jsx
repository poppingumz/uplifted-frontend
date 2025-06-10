import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import {
    getCurrentUser,
    updateUser,
    fetchUserCourses,
    fetchEnrolledCourses,
    fetchUserQuizzes,
    deleteCourse,
    deleteQuiz
} from '../services/api';
import Cookies from 'js-cookie';
import QuizList from '../components/QuizList';
import InterestSelector from '../components/InterestSelector';

const Account = () => {
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState('/default-profile.png');
    const [activeTab, setActiveTab] = useState('details');
    const [createdCourses, setCreatedCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [interests, setInterests] = useState(() => {
        const saved = localStorage.getItem('interests');
        return saved ? JSON.parse(saved) : [];
    });

    const navigate = useNavigate();

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
                        headers: { Authorization: `Bearer ${parsed.token}` }
                    });
                    if (res.ok) {
                        const blob = await res.blob();
                        imageUrl = URL.createObjectURL(blob);
                        setPreview(imageUrl);
                    }
                }

                fetchUserCourses(userData.id).then(setCreatedCourses).catch(console.error);
                fetchEnrolledCourses(userData.id).then(setEnrolledCourses).catch(console.error);
                fetchUserQuizzes(userData.id).then(setQuizzes).catch(console.error);
            } catch (err) {
                console.error("Failed to load user or image", err);
            }
        };

        fetchUserAndImage();
        return () => { if (imageUrl) URL.revokeObjectURL(imageUrl); };
    }, []);

    // 🔁 Sync interests to user cookie whenever they change
    useEffect(() => {
        if (!user) return;

        const userStr = Cookies.get('user');
        if (!userStr) return;

        try {
            const parsed = JSON.parse(userStr);
            parsed.interests = interests;
            Cookies.set('user', JSON.stringify(parsed), { expires: 7 });
        } catch (e) {
            console.error("❌ Failed to update user interests in cookie:", e);
        }
    }, [interests, user]);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = e => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await updateUser(user.id, user, profileImage);
            alert("Profile updated!");
        } catch (error) {
            console.error("Update failed:", error);
            alert("Something went wrong");
        }
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            Cookies.remove('user');
            navigate('/login');
        }
    };

    const handleDeleteCourse = async courseId => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            const { token } = JSON.parse(Cookies.get('user'));
            await deleteCourse(courseId, token);
            setCreatedCourses(prev => prev.filter(c => c.id !== courseId));
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete course.");
        }
    };

    const handleDeleteQuiz = async quizId => {
        if (!window.confirm("Are you sure you want to delete this quiz?")) return;
        try {
            const { token } = JSON.parse(Cookies.get('user'));
            await deleteQuiz(quizId, token);
            setQuizzes(prev => prev.filter(q => q.id !== quizId));
        } catch (err) {
            console.error("Delete quiz failed:", err);
            alert("Failed to delete quiz.");
        }
    };

    if (!user) return <p className="account-loading">Loading...</p>;

    return (
        <>
            <Navbar />
            <div className="account-wrapper">
                <div className="account-sidebar">
                    <img src={preview} alt="Profile" className="account-image" />
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    <div className="tabs">
                        <button onClick={() => setActiveTab('details')} className={activeTab === 'details' ? 'active' : ''}>Account Details</button>
                        {user.role === 'TEACHER' && (
                            <>
                                <button onClick={() => setActiveTab('created')} className={activeTab === 'created' ? 'active' : ''}>Courses Created</button>
                                <button onClick={() => setActiveTab('quizzes')} className={activeTab === 'quizzes' ? 'active' : ''}>Quizzes</button>
                            </>
                        )}
                        {(user.role === 'STUDENT' || user.role === 'TEACHER') && (
                            <button onClick={() => setActiveTab('interests')} className={activeTab === 'interests' ? 'active' : ''}>Interests</button>
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
                                <button onClick={() => navigate('/createcourse')} className="create-course-button">+ Create New Course</button>
                            </div>
                            {createdCourses.length === 0 ? (
                                <p>No created courses yet.</p>
                            ) : (
                                <div className="courses-grid">
                                    {createdCourses.map(course => (
                                        <div key={course.id} className="course-card">
                                            <div className="course-card-clickable" onClick={() => navigate(`/courses/${course.id}`)}>
                                                {course.imageData && (
                                                    <img src={`data:image/jpeg;base64,${course.imageData}`} alt={course.title} className="course-card-image" />
                                                )}
                                                <div className="course-card-content">
                                                    <h3>{course.title}</h3>
                                                    <p><strong>Category:</strong> {course.category || 'N/A'}</p>
                                                    <p><strong>Limit:</strong> {course.enrollmentLimit}</p>
                                                    <p><strong>Status:</strong> {course.published ? 'Published' : 'Draft'}</p>
                                                    <p><strong>Rating:</strong> {course.rating ?? 0} ⭐ ({course.numberOfReviews ?? 0} reviews)</p>
                                                </div>
                                            </div>
                                            <div className="course-card-actions">
                                                <button onClick={() => navigate(`/createcourse/${course.id}`)} className="edit-course-btn">✏️ Edit</button>
                                                <button onClick={() => navigate(`/courses/${course.id}`)} className="view-course-btn">🔍 View</button>
                                                <button onClick={() => handleDeleteCourse(course.id)} className="delete-course-btn">🗑️ Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {user.role === 'TEACHER' && activeTab === 'quizzes' && (
                        <div className="account-courses">
                            <QuizList quizzes={quizzes} onDeleteQuiz={handleDeleteQuiz} />
                        </div>
                    )}

                    {(user.role === 'TEACHER' || user.role === 'STUDENT') && activeTab === 'interests' && (
                        <div className="account-courses">
                            <h2>Your Interests</h2>
                            <InterestSelector selected={interests} setSelected={setInterests} />
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
