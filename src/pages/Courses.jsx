import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { fetchCourses } from '../services/api';
import CourseList from '../components/CourseList';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses()
            .then(data => {
                setCourses(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch courses", error);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Navbar />
            <div className="container">
                <h1>Courses</h1>
                {loading ? <p>Loading courses...</p> : <CourseList courses={courses} />}
            </div>
        </>
    );
};

export default Courses;
