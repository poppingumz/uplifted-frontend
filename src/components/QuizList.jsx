import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuizList = ({ quizzes, onDeleteQuiz }) => {
  const navigate = useNavigate();

  if (!quizzes || quizzes.length === 0) {
    return <p>No quizzes found.</p>;
  }

  return (
    <div className="quiz-list">
      <div className="account-courses-header">
        <h2>Your Quizzes</h2>
        <button onClick={() => navigate('/createquiz')} className="create-course-button">
          + Create New Quiz
        </button>
      </div>

      <div className="courses-grid">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-card">
            <div className="quiz-card-header">
              <h3 className="quiz-title">{quiz.title}</h3>
              <p className="quiz-course">
                <strong>Course:</strong> {quiz.courseTitle || 'None'}
              </p>
            </div>

            <div className="quiz-card-body">
              <p className="quiz-description">{quiz.description}</p>
              <p>
                <strong>Total Marks:</strong> {quiz.totalMarks}
              </p>
              <p>
                <strong>Passing Marks:</strong> {quiz.passingMarks}
              </p>
            </div>

            <div className="course-card-actions">
              <button
                onClick={() => navigate(`/createquiz/${quiz.id}`)}
                className="edit-course-btn"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => onDeleteQuiz(quiz.id)}
                className="delete-course-btn"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
