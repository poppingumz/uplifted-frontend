import React from 'react';

const Step3_Review = ({ course, handleChange, handleSubmit }) => {
  return (
    <div className="form-step review-step" data-cy="review-step">
      <h3 className="review-heading" data-cy="review-heading">📝 Review Your Course</h3>

      <div className="review-details">
        <div className="review-row" data-cy="review-title">
          <span className="review-label">📚 Title:</span>
          <span className="review-value">{course.title || <em>None</em>}</span>
        </div>
        <div className="review-row" data-cy="review-description">
          <span className="review-label">🗒️ Description:</span>
          <span className="review-value">{course.description || <em>None</em>}</span>
        </div>
        <div className="review-row" data-cy="review-category">
          <span className="review-label">🏷️ Category:</span>
          <span className="review-value">{course.category || <em>None</em>}</span>
        </div>
        <div className="review-row" data-cy="review-enrollment-limit">
          <span className="review-label">👥 Enrollment Limit:</span>
          <span className="review-value">{course.enrollmentLimit}</span>
        </div>
        <div className="review-row" data-cy="review-published">
          <span className="review-label">📢 Published:</span>
          <span className="review-value">
            {course.published ? '✅ Yes' : '❌ No'}
          </span>
        </div>
      </div>

      <h4 className="review-subheading" data-cy="parts-overview-title">📦 Parts Overview:</h4>
      {course.parts.length === 0 ? (
        <p className="no-parts" data-cy="no-parts"><em>No parts added yet.</em></p>
      ) : (
        <ul className="review-list" data-cy="review-parts-list">
          {course.parts.map((part, index) => (
            <li key={index} className="review-part" data-cy={`review-part-${index}`}>
              <div className="part-info">
                <strong>{index + 1}.</strong>
                <span className="part-title"> Week {part.weekNumber} – {part.title}</span>
              </div>
              <div className="part-content-preview">
                {(part.quizzes?.length > 0 || part.videos?.length > 0 || part.files?.length > 0) ? (
                  <>
                    {part.files?.length > 0 && (
                      <p data-cy={`part-${index}-files`}>📄 <strong>{part.files.length}</strong> file(s) added</p>
                    )}
                    {part.quizzes?.length > 0 && (
                      <p data-cy={`part-${index}-quizzes`}>📝 <strong>{part.quizzes.length}</strong> quiz(zes) added</p>
                    )}
                    {part.videos?.length > 0 && (
                      <p data-cy={`part-${index}-videos`}>🎥 <strong>{part.videos.length}</strong> video(s) added</p>
                    )}
                  </>
                ) : (
                  <p data-cy={`part-${index}-no-content`}><em>No content provided.</em></p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="publish-container" data-cy="publish-toggle">
        <label className="toggle-switch">
          <input type="checkbox" name="published" checked={course.published} onChange={handleChange} data-cy="publish-checkbox" />
          <span className="slider"></span>
          <span className="toggle-label">🌍 Publish Now</span>
        </label>
      </div>

      <button
        type="submit"
        className="submit-course-btn"
        data-cy="submit-course-btn"
        onClick={handleSubmit}
      >
        🚀 Submit Course
      </button>
    </div>
  );
};

export default Step3_Review;
