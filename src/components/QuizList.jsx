import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/quizlist.css';

const QuizList = ({ quizzes, onDeleteQuiz }) => {
    const navigate = useNavigate();

    if (!quizzes.length) {
        return <p className="account-loading">No quizzes created yet.</p>;
    }

    const handleDelete = (quizId) => {
        const confirmed = window.confirm('Are you sure you want to delete this quiz?');
        if (confirmed) {
            onDeleteQuiz(quizId);
        }
    };

    return (
        <div className="account-courses">
            <div className="account-courses-header">
                <h2>Quizzes You Created</h2>
                <button onClick={() => navigate('/createquiz')} className="create-course-button">
                    + Create New Quiz
                </button>
            </div>
            <div className="courses-grid">
                {quizzes.map((quiz) => (
                    <div key={quiz.id} className="course-card quiz-card">
                        <div className="quiz-card-header">
                            <h3 className="quiz-title">{quiz.title}</h3>
                            <p className="quiz-course"><strong>Course:</strong> {quiz.courseTitle || 'None'}</p>
                        </div>
                        <div className="quiz-card-body">
                            <p className="quiz-description">{quiz.description}</p>
                            <p><strong>Total Marks:</strong> {quiz.totalMarks}</p>
                            <p><strong>Passing Marks:</strong> {quiz.passingMarks}</p>
                        </div>
                        <div className="course-card-actions">
                            <button onClick={() => navigate(`/editquiz/${quiz.id}`)} className="edit-course-btn">✏️ Edit</button>
                            <button onClick={() => navigate(`/quiz/${quiz.id}`)} className="view-course-btn">🔍 View</button>
                            <button onClick={() => handleDelete(quiz.id)} className="delete-course-btn">🗑️ Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizList;
