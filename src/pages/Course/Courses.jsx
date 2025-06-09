import React, { useEffect, useState } from 'react';
import { fetchCourses } from '../../services/api';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchCourses()
            .then(setCourses)
            .catch(console.error);
    }, []);

    return (
        <>
            <Navbar />
            <div className="courses-container">
                <h1 className="courses-title">Explore Our Courses</h1>
                <div className="courses-grid">
                    {courses.map(course => (
                        <div className="course-card" key={course.id}>
                            {course.imageData && (
                                <img
                                    className="course-image"
                                    src={`data:image/jpeg;base64,${course.imageData}`}
                                    alt={course.title}
                                />
                            )}
                            <div className="course-info">
                                <h2>{course.title}</h2>
                                <p className="course-description">{course.description}</p>
                                <p className="course-category"><strong>Category:</strong> {course.category}</p>
                                <p className="course-rating">
                                    ⭐ {course.rating?.toFixed(1) || 'N/A'} ({course.numberOfReviews || 0} reviews)
                                </p>
                                <Link to={`/courses/${course.id}`} className="view-button">View Details</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CoursesPage;
