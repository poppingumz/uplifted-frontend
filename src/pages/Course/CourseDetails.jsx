import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { fetchCourseById, fetchUserById } from '../../services/api';
import Cookies from 'js-cookie';

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [instructor, setInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadCourse = async () => {
            try {
                const courseData = await fetchCourseById(id);
                setCourse(courseData);
                if (courseData.instructorId) {
                    const instructorData = await fetchUserById(courseData.instructorId);
                    setInstructor(instructorData);
                }
            } catch (error) {
                console.error('Failed to fetch course details', error);
            } finally {
                setLoading(false);
            }
        };
        loadCourse();
    }, [id]);

    const handleEnroll = async () => {
    const cookie = Cookies.get('user');
    if (!cookie) return alert("Please log in to enroll.");

    const parsed = JSON.parse(cookie);
    const userId = parsed.id;
    const token = parsed.token;

    try {
        const res = await fetch(`http://localhost:8080/api/courses/${id}/enroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId })
        });

        if (res.ok) {
            setEnrolled(true);
            setMessage("Successfully enrolled!");
        } else {
            const result = await res.json();
            setMessage(result?.error || "Failed to enroll");
        }
    } catch (err) {
        console.error("Enrollment failed", err);
        setMessage("Error during enrollment");
    }
};


    if (loading) return <p>Loading course...</p>;
    if (!course) return <p>Course not found.</p>;

    return (
        <>
            <Navbar />
            <div className="course-banner">
                {course.imageData && (
                    <img
                        src={`data:image/jpeg;base64,${course.imageData}`}
                        alt={course.title}
                        className="banner-image"
                    />
                )}
                <div className="banner-content">
                    <h1>{course.title}</h1>
                    <div className="course-meta">
                        <span>📂 {course.category}</span>
                        <span>⭐ {course.rating} ({course.numberOfReviews} reviews)</span>
                        <span>👥 Limit: {course.enrollmentLimit}</span>
                        <span>{course.published ? '✅ Published' : '🕓 Draft'}</span>
                    </div>
                    {message && <p className="message">{message}</p>}
                    {!enrolled ? (
                        <button className="enroll-btn" onClick={handleEnroll}>Enroll Now</button>
                    ) : (
                        <p className="enrolled-msg">✅ You are enrolled</p>
                    )}
                </div>
            </div>

            {instructor && (
                <div className="instructor-card">
                    <img src="/default-profile.png" className="instructor-img" alt="Instructor" />
                    <h3>{instructor.firstName} {instructor.lastName}</h3>
                    <p className="instructor-title">Instructor</p>
                    <p className="instructor-bio">{instructor.bio || "This instructor has not provided a bio yet."}</p>
                </div>
            )}
        </>
    );
};

export default CourseDetails;
