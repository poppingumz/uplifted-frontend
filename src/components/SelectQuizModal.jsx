import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserQuizzes } from '../services/api';
import Cookies from 'js-cookie';
import '../styles/select-quiz-modal.css';

const SelectQuizModal = ({ isOpen, onClose, onSelect }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const loadQuizzes = async () => {
        try {
          const cookie = Cookies.get('user');
          const parsed = cookie ? JSON.parse(cookie) : null;
          const data = await fetchUserQuizzes(parsed.id);
          setQuizzes(data);
        } catch (err) {
          console.error('Failed to load quizzes:', err);
          setError('Failed to load quizzes');
        } finally {
          setLoading(false);
        }
      };

      loadQuizzes();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select a Quiz</h2>
        <button className="close-btn" onClick={onClose}>❌</button>
        {loading ? (
          <p>Loading quizzes...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul className="quiz-list">
            {quizzes.map((quiz) => (
              <li key={quiz.id}>
                <strong>{quiz.title}</strong> – {quiz.description}
                <div className="actions">
                  <button onClick={() => onSelect({ id: quiz.id, title: quiz.title })}>➕ Add</button>
                  <button onClick={() => navigate(`/createquiz/${quiz.id}`)}>✏️ Edit</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button className="create-btn" onClick={() => navigate('/createquiz')}>+ Create New Quiz</button>
      </div>
    </div>
  );
};

export default SelectQuizModal;
