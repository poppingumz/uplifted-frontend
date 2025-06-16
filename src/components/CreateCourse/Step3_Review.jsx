import React from 'react';

const Step3_Review = ({ course, handleChange, handleSubmit }) => {
  return (
    <div className="form-step review-step">
      <h3 className="review-heading">📝 Review Your Course</h3>

      <div className="review-details">
        <div className="review-row">
          <span className="review-label">📚 Title:</span>
          <span className="review-value">{course.title || <em>None</em>}</span>
        </div>
        <div className="review-row">
          <span className="review-label">🗒️ Description:</span>
          <span className="review-value">{course.description || <em>None</em>}</span>
        </div>
        <div className="review-row">
          <span className="review-label">🏷️ Category:</span>
          <span className="review-value">{course.category || <em>None</em>}</span>
        </div>
        <div className="review-row">
          <span className="review-label">👥 Enrollment Limit:</span>
          <span className="review-value">{course.enrollmentLimit}</span>
        </div>
        <div className="review-row">
          <span className="review-label">📢 Published:</span>
          <span className="review-value">
            {course.published ? '✅ Yes' : '❌ No'}
          </span>
        </div>
      </div>

      <h4 className="review-subheading">📦 Parts Overview:</h4>
      {course.parts.length === 0 ? (
        <p className="no-parts"><em>No parts added yet.</em></p>
      ) : (
        <ul className="review-list">
          {course.parts.map((part, index) => (
            <li key={index} className="review-part">
              <div className="part-info">
                <strong>{index + 1}.</strong>
                <span className="part-title"> Week {part.weekNumber} – {part.title}</span>
              </div>
              <div className="part-content-preview">
  {(part.quizzes?.length > 0 || part.videos?.length > 0 || part.files?.length > 0) ? (
    <>
      {part.files?.length > 0 && (
        <p>📄 <strong>{part.files.length}</strong> file(s) added</p>
      )}
      {part.quizzes?.length > 0 && (
        <p>📝 <strong>{part.quizzes.length}</strong> quiz(zes) added</p>
      )}
      {part.videos?.length > 0 && (
        <p>🎥 <strong>{part.videos.length}</strong> video(s) added</p>
      )}
    </>
  ) : (
    <p><em>No content provided.</em></p>
  )}
</div>

            </li>
          ))}
        </ul>
      )}

      <div className="publish-container">
        <label className="toggle-switch">
          <input type="checkbox" name="published" checked={course.published} onChange={handleChange} />
          <span className="slider"></span>
          <span className="toggle-label">🌍 Publish Now</span>
        </label>
      </div>

      <button type="submit" className="submit-course-btn" onClick={handleSubmit}>
        🚀 Submit Course
      </button>
    </div>
  );
};

export default Step3_Review;
