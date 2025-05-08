import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { fetchCourseById, fetchUserById } from '../../services/api';

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [instructor, setInstructor] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <p>Loading course details...</p>;
    if (!course) return <p>Course not found.</p>;

    return (
        <>
            <Navbar />
            <div className="course-details-container">
                <div className="course-header">
                    {course.imageData && (
                        <img
                            src={`data:image/jpeg;base64,${course.imageData}`}
                            alt={course.title}
                            className="course-image"
                        />
                    )}
                    <div className="course-info">
                        <h1>{course.title}</h1>
                        <p><strong>Category:</strong> {course.category}</p>
                        <p><strong>Rating:</strong> {course.rating} ⭐ ({course.numberOfReviews} reviews)</p>
                        <p><strong>Enrollment Limit:</strong> {course.enrollmentLimit}</p>
                        <p><strong>Status:</strong> {course.published ? 'Published' : 'Draft'}</p>
                        {instructor && (
                            <p><strong>Instructor:</strong> {instructor.firstName} {instructor.lastName}</p>
                        )}
                        <button className="enroll-button">Enroll Now</button>
                    </div>
                </div>
                <div className="course-description">
                    <h2>Description</h2>
                    <p>{course.description}</p>
                </div>
            </div>
        </>
    );
};

export default CourseDetails;
