import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Step1_Info from '../../components/CreateCourse/Step1_Info';
import Step2_Structure from '../../components/CreateCourse/Step2_Structure';
import Step3_Review from '../../components/CreateCourse/Step3_Review';
import '../../styles/create-course.css';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { id: courseId } = useParams(); // alias `id` to `courseId`
  const isEditMode = !!courseId;

  const [step, setStep] = useState(1);
  const [decoded, setDecoded] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [course, setCourse] = useState({
    title: '',
    description: '',
    instructorId: null,
    category: '',
    enrollmentLimit: 30,
    published: false,
    parts: []
  });
  const [image, setImage] = useState(null);
  const [newPart, setNewPart] = useState({
    title: '',
    contents: []
  });

useEffect(() => {
  const cookie = Cookies.get('user');
  if (!cookie) return navigate('/login');

  const parsed = JSON.parse(cookie);
  const decodedToken = jwtDecode(parsed.token);
  setDecoded(decodedToken);

  if (decodedToken.role === 'STUDENT') {
    navigate('/unauthorized');
    return;
  }

  if (!isEditMode) {
    setCourse(prev => ({ ...prev, instructorId: decodedToken.userId }));
  }

  if (isEditMode) {
    axios.get(`http://localhost:8080/api/courses/${courseId}`)
      .then(res => {
        const data = res.data;

        // ⬇️ Enrich course.parts with frontend-specific fields
        const enrichedParts = data.parts?.map(part => {
          const files = part.contents?.filter(c => c.contentType === 'FILE').map(c => c.title);
          const quizzes = part.contents?.filter(c => c.contentType === 'QUIZ').map(c => c.title);
          const videos = part.contents?.filter(c => c.contentType === 'VIDEO').map(c => c.title);
          return {
            ...part,
            files,
            quizzes,
            videos,
            week: part.weekNumber?.toString() || ''
          };
        }) || [];

        setCourse({
          id: data.id,
          title: data.title,
          description: data.description,
          instructorId: data.instructorId,
          category: data.category,
          enrollmentLimit: data.enrollmentLimit,
          published: data.published,
          parts: enrichedParts
        });
      })
      .catch(err => {
        console.error('Failed to load course:', err);
        alert('Could not load course for editing.');
        navigate('/account');
      });
  }
}, [navigate, courseId, isEditMode]);


  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setCourse(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = e => {
    setImage(e.target.files[0]);
  };

  const deletePart = index => {
    setCourse(prev => ({
      ...prev,
      parts: prev.parts.filter((_, i) => i !== index)
    }));
    setExpandedIndex(null);
  };

const handleSubmit = async e => {
  e.preventDefault();
  const formData = new FormData();

  // Add course JSON
  formData.append('course', new Blob([JSON.stringify(course)], { type: 'application/json' }));

  // Add image if present
  if (image) {
    formData.append('image', image);
  }

  // ✅ Append all files from all course parts
  course.parts.forEach(part => {
    if (part.files?.length) {
      part.files.forEach(file => {
        formData.append('files', file);
      });
    }
  });

  try {
    const parsed = JSON.parse(Cookies.get('user'));
    const config = {
      headers: {
        'Authorization': `Bearer ${parsed.token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    if (isEditMode) {
      await axios.put(`http://localhost:8080/api/courses/${courseId}`, formData, config);
      alert('Course updated successfully!');
    } else {
      await axios.post('http://localhost:8080/api/courses', formData, config);
      alert('Course created successfully!');
    }

    navigate('/account');
  } catch (err) {
    console.error('Failed to submit course:', err.response?.data || err.message);
    alert(`Failed to submit course: ${err.response?.data?.message || err.message}`);
  }
};


  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
  const toggleExpand = index => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  return (
    <>
      <Navbar />
      <div className="create-course-page">
        <div className="form-container-create">
          <h1>{isEditMode ? '✏️ Edit Course' : '🆕 Create New Course'}</h1>

          <div className="steps">
            <button onClick={() => setStep(1)}>Step 1: Info</button>
            <button onClick={() => setStep(2)}>Step 2: Structure</button>
            <button onClick={() => setStep(3)}>Step 3: Review</button>
          </div>

          {step === 1 && (
            <Step1_Info
              course={course}
              handleChange={handleChange}
              handleImageChange={handleImageChange}
              image={image}
            />
          )}

          {step === 2 && (
            <Step2_Structure
              newPart={newPart}
              setNewPart={setNewPart}
              course={course}
              setCourse={setCourse}
              deletePart={deletePart}
              expandedIndex={expandedIndex}
              toggleExpand={toggleExpand}
            />
          )}

          {step === 3 && (
            <Step3_Review
              course={course}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          )}

          <div className="step-nav-buttons">
            {step > 1 && <button type="button" onClick={prevStep}>Previous</button>}
            {step < 3 && <button type="button" onClick={nextStep}>Next</button>}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCourse;
