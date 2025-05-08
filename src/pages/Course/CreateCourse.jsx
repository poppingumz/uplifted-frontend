import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';


const CreateCoursePage = () => {
    const [course, setCourse] = useState({
        title: '',
        description: '',
        instructorId: 1,  // temp hardcoded until auth is in place
        category: '',
        enrollmentLimit: 30,
        published: false
    });
    const [image, setImage] = useState(null);

    const handleChange = e => {
        const { name, value } = e.target;
        setCourse(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = e => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('course', new Blob([JSON.stringify(course)], { type: 'application/json' }));
        if (image) formData.append('image', image);

        try {
            await axios.post('http://localhost:8080/api/courses', formData);
            alert('Course created successfully!');
        } catch (err) {
            console.error('Failed to create course:', err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="create-course-page">
                <div className="form-container">
                    <h1>Create a New Course</h1>
                    <form onSubmit={handleSubmit}>
                        <label>Course Title</label>
                        <input type="text" name="title" value={course.title} onChange={handleChange} required />

                        <label>Description</label>
                        <textarea name="description" value={course.description} onChange={handleChange} required />

                        <label>Category</label>
                        <input type="text" name="category" value={course.category} onChange={handleChange} required />

                        <label>Enrollment Limit</label>
                        <input type="number" name="enrollmentLimit" value={course.enrollmentLimit} onChange={handleChange} required />

                        <label>Course Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />

                        <div className="checkbox-group">
                            <input type="checkbox" name="published" checked={course.published} onChange={handleChange} />
                            <label>Publish Now</label>
                        </div>

                        <button type="submit" className="submit-btn">Create Course</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateCoursePage;
