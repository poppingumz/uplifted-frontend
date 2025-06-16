// CourseDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import {
  fetchCourseById,
  fetchUserById,
  fetchEnrolledCourses,
  enrollInCourse,
  unenrollFromCourse,
  downloadFile
} from '../../services/api';
import Cookies from 'js-cookie';
import '../../styles/course-details.css';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [message, setMessage] = useState('');
  const [expandedParts, setExpandedParts] = useState({});

  const reloadEnrollment = async () => {
    const userStr = Cookies.get('user');
    if (!userStr) return setEnrolled(false);
    const user = JSON.parse(userStr);
    try {
      const list = await fetchEnrolledCourses(user.id);
      setEnrolled(list.some(c => c.id === Number(id)));
    } catch {
      setEnrolled(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const cd = await fetchCourseById(id);
        setCourse(cd);
        if (cd.instructorId) {
          setInstructor(await fetchUserById(cd.instructorId));
        }
        await reloadEnrollment();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleEnroll = async () => {
    if (!Cookies.get('user')) return alert('Please log in.');
    try {
      await enrollInCourse(id);
      setMessage('Enrolled!');
      await reloadEnrollment();
    } catch (e) {
      setMessage(e.message);
    }
  };

  const handleUnenroll = async () => {
    if (!window.confirm('Unenroll?')) return;
    try {
      await unenrollFromCourse(id);
      setMessage('Unenrolled.');
      await reloadEnrollment();
    } catch (e) {
      setMessage(e.message);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      await downloadFile(fileId, fileName);
    } catch (e) {
      console.error('Download failed:', e);
      alert('Download failed');
    }
  };

  const togglePart = idx => {
    setExpandedParts(p => ({ ...p, [idx]: !p[idx] }));
  };

  if (loading) return <p>Loading…</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <>
      <Navbar />
      <div className="course-banner">
        {course.imageData && (
          <img
            className="banner-image"
            src={`data:image/jpeg;base64,${course.imageData}`}
            alt={course.title}
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
            <button onClick={handleEnroll} className="enroll-btn">Enroll Now</button>
          ) : (
            <>
              <p className="enrolled-msg">✅ You are enrolled</p>
              <button onClick={handleUnenroll} className="unenroll-btn">Unenroll</button>
            </>
          )}
        </div>
      </div>

      <div className="course-layout">
        <div className="structure-column">
          <h2>📚 Course Structure</h2>
          {course.parts?.map((part, pi) => (
            <div key={pi} className="course-part">
              <h3 onClick={() => togglePart(pi)} style={{ cursor: 'pointer' }}>
                {expandedParts[pi] ? '▼' : '▶'} Week {part.weekNumber}: {part.title}
              </h3>
              {expandedParts[pi] && (
                <ul>
                  {part.contents.map((c, ci) => {
                    const { contentType, contentId, title } = c;

                    if (contentType === 'FILE') {
                      return (
                        <li key={ci}>
                          📄 <strong>{title}</strong>{' '}
                          {enrolled && contentId ? (
                            <button
                              className="file-link"
                              onClick={() => handleDownload(contentId, title)}
                            >
                              ⬇ Download
                            </button>
                          ) : (
                            <em>{contentId ? '(Enroll to download)' : '(No file)'}</em>
                          )}
                        </li>
                      );
                    }

                    if (contentType === 'QUIZ') {
                      return (
                        <li key={ci}>
                          📝 <strong>{title}</strong>{' '}
                          {enrolled ? (
                            <button
                              className="quiz-btn"
                              onClick={() => window.location.href = `/quiz/${contentId}`}
                            >
                              ▶ View Quiz
                            </button>
                          ) : (
                            <em>(Enroll to access quiz)</em>
                          )}
                        </li>
                      );
                    }
// VIDEO
if (contentType === 'VIDEO') {
  return (
    <li key={ci}>
      🎥 <strong>Video</strong>{' '}
      {enrolled ? (
        <a
          href={title}
          target="_blank"
          rel="noreferrer"
          className="watch-link"
        >
          ▶ Watch
        </a>
      ) : (
        <em>(Enroll to watch video)</em>
      )}
    </li>
  );
}



                    return null;
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>

        {instructor && (
          <div className="instructor-column">
            <div className="instructor-card large">
              <img
                className="instructor-img"
                src={
                  instructor.profileImage
                    ? `data:image/jpeg;base64,${instructor.profileImage}`
                    : '/default-profile.png'
                }
                alt="Instructor"
              />
              <h3>{instructor.firstName} {instructor.lastName}</h3>
              <p className="instructor-title">Instructor</p>
              <p className="instructor-bio">
                {instructor.bio || 'No bio yet.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseDetails;
