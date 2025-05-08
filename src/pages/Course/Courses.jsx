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
            <div className="courses-page">
                <h1>Available Courses</h1>
                <div className="course-grid">
                    {courses.map(course => (
                        <div className="course-card" key={course.id}>
                            <h2>{course.title}</h2>
                            <p>{course.description}</p>
                            <p>Category: {course.category}</p>
                            <Link to={`/courses/${course.id}`} className="view-button">View Details</Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CoursesPage;
