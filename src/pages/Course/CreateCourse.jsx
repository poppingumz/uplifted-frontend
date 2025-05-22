import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const CreateCoursePage = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [decoded, setDecoded] = useState(null);
    const [course, setCourse] = useState({
        title: '',
        description: '',
        instructorId: null,
        category: '',
        enrollmentLimit: 30,
        published: false
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        const cookie = Cookies.get('user');
        if (cookie) {
            const parsed = JSON.parse(cookie);
            const decodedToken = jwtDecode(parsed.token);
            setDecoded(decodedToken);

            if (decodedToken.role === 'STUDENT') {
                navigate('/unauthorized');
            } else {
                setRole(decodedToken.role);
                setCourse(prev => ({ ...prev, instructorId: decodedToken.userId }));
                console.log("Decoded JWT:", decodedToken);
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setCourse(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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
            const parsed = JSON.parse(Cookies.get('user'));
            await axios.post('http://localhost:8080/api/courses', formData, {
                headers: {
                    'Authorization': `Bearer ${parsed.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Course created successfully!');
            navigate('/account');
        } catch (err) {
            console.error('Failed to create course:', err);
            alert('Failed to create course.');
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
