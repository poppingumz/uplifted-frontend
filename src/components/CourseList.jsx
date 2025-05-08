import React from 'react';

const CourseList = ({ courses }) => {
    if (courses.length === 0) return <p>No courses available.</p>;

    return (
        <div className="courses-page">
            <div className="courses-list">
                {courses.map(course => (
                    <div className="course-card" key={course.id}>
                        {course.imageData && (
                            <img 
                                src={`data:image/jpeg;base64,${course.imageData}`} 
                                alt={course.title} 
                                className="course-image"
                            />
                        )}
                        <h2>{course.title}</h2>
                        <p><strong>Description:</strong> {course.description}</p>
                        <p><strong>Category:</strong> {course.category}</p>
                        <p><strong>Rating:</strong> {course.rating} ⭐</p>
                        <p><strong>Reviews:</strong> {course.numberOfReviews}</p>
                        <button className="enroll-button">Enroll Now</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseList;
