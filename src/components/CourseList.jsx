import React from 'react';

const CourseList = ({ courses }) => {
    if (courses.length === 0) return <p>No courses available.</p>;

    return (
        <div className="courses-page">
            <div className="courses-list">
                {courses.map(course => (
                    <div className="course-card" key={course.id}>
                        <h2>{course.title}</h2>
                        <p>{course.description}</p>
                        <button className="enroll-button">Enroll Now</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseList;
