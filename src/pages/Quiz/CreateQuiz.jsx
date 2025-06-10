import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createQuiz, fetchQuizById, updateQuiz } from '../../services/api';
import Navbar from '../../components/Navbar';
import Cookies from 'js-cookie';
import '../../styles/create-quiz.css';

const defaultAnswer = { text: '', correct: false, explanation: '' };
const defaultQuestion = {
  text: '',
  type: 'MULTIPLE_CHOICE',
  marks: 1,
  correctAnswer: '',
  requiresReview: false,
  answers: [structuredClone(defaultAnswer)]
};

const CreateQuiz = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    totalMarks: 0,
    passingMarks: 0,
    questions: []
  });

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const loadQuizIfEditing = async () => {
      if (id) {
        try {
          const data = await fetchQuizById(id);
          setQuiz(data);
        } catch (err) {
          console.error('Failed to load quiz:', err);
          alert('Failed to load quiz for editing.');
        }
      }
    };
    loadQuizIfEditing();
  }, [id]);

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...quiz.questions];
    updated[index][field] = value;
    setQuiz({ ...quiz, questions: updated });
  };

  const handleAnswerChange = (qIdx, aIdx, field, value) => {
    const updated = [...quiz.questions];
    updated[qIdx].answers[aIdx][field] = value;
    setQuiz({ ...quiz, questions: updated });
  };

  const addQuestion = () => {
    setQuiz({ ...quiz, questions: [...quiz.questions, structuredClone(defaultQuestion)] });
    setActiveTab(quiz.questions.length);
  };

  const removeQuestion = (index) => {
    const updated = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updated });
    setActiveTab((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const addAnswer = (qIdx) => {
    const updated = [...quiz.questions];
    updated[qIdx].answers.push(structuredClone(defaultAnswer));
    setQuiz({ ...quiz, questions: updated });
  };

  const removeAnswer = (qIdx, aIdx) => {
    const updated = [...quiz.questions];
    updated[qIdx].answers = updated[qIdx].answers.filter((_, i) => i !== aIdx);
    setQuiz({ ...quiz, questions: updated });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const cookie = Cookies.get('user');
    const user = cookie ? JSON.parse(cookie) : null;
    if (!user) throw new Error('User not found');

    const payload = {
      ...quiz,
      createdById: user.id,
      courseId: quiz.courseId || null
    };

    if (isEditMode) {
      await updateQuiz(quiz.id, payload, user.token);
      alert('Quiz updated!');
    } else {
      await createQuiz(payload, user.token);
      alert('Quiz created!');
    }

    navigate('/account');
  } catch (err) {
    console.error('Submit failed:', err);
    alert('Failed to submit quiz.');
  }
};

  return (
    <>
      <Navbar />
      <div className="create-quiz-page">
        <div className="quiz-form-container">
          <h2>{id ? 'Edit Quiz' : 'Create New Quiz'}</h2>

          <form onSubmit={handleSubmit}>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setQuiz({
                  title: 'Java Basics Quiz',
                  description: 'Test your understanding of Java fundamentals.',
                  totalMarks: 10,
                  passingMarks: 6,
                  questions: [
                    {
                      text: 'What is the size of an int in Java?',
                      type: 'MULTIPLE_CHOICE',
                      marks: 2,
                      correctAnswer: '4 bytes',
                      requiresReview: false,
                      answers: [
                        { text: '2 bytes', correct: false, explanation: 'That’s short.' },
                        { text: '4 bytes', correct: true, explanation: 'Correct!' },
                        { text: '8 bytes', correct: false, explanation: 'That’s long.' },
                        { text: 'Depends on OS', correct: false, explanation: 'Java defines it explicitly.' }
                      ]
                    },
                    {
                      text: 'True or False: Java supports multiple inheritance.',
                      type: 'TRUE_FALSE',
                      marks: 2,
                      correctAnswer: 'False',
                      requiresReview: false,
                      answers: [
                        { text: 'True', correct: false, explanation: 'Only through interfaces.' },
                        { text: 'False', correct: true, explanation: 'Java avoids diamond problem.' }
                      ]
                    }
                  ]
                });
              }}
            >
              Fill Sample Quiz
            </button>

            <label>Title</label>
            <input name="title" value={quiz.title} onChange={handleQuizChange} required />

            <label>Description</label>
            <textarea name="description" value={quiz.description} onChange={handleQuizChange} required />

            <div className="inline-input-group">
              <div className="inline-input">
                <label>Total Marks</label>
                <input name="totalMarks" type="number" value={quiz.totalMarks} onChange={handleQuizChange} required />
              </div>
              <div className="inline-input">
                <label>Passing Marks</label>
                <input name="passingMarks" type="number" value={quiz.passingMarks} onChange={handleQuizChange} required />
              </div>
            </div>

            <div className="question-tabs">
              {quiz.questions.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`tab-button ${activeTab === idx ? 'active' : ''}`}
                  onClick={() => setActiveTab(idx)}
                >
                  Q{idx + 1}
                </button>
              ))}
              <button type="button" className="btn" onClick={addQuestion}>+ Add Question</button>
            </div>

            {quiz.questions.length > 0 && (
              <div className="question-block">
                <label>Question Text</label>
                <input
                  value={quiz.questions[activeTab].text}
                  onChange={e => handleQuestionChange(activeTab, 'text', e.target.value)}
                  required
                />

                <div className="inline-input-group">
                  <div className="inline-input">
                    <label>Type</label>
                    <select
                      value={quiz.questions[activeTab].type}
                      onChange={e => handleQuestionChange(activeTab, 'type', e.target.value)}
                    >
                      <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                      <option value="TRUE_FALSE">True / False</option>
                    </select>
                  </div>

                  <div className="inline-input">
                    <label>Marks</label>
                    <input
                      type="number"
                      value={quiz.questions[activeTab].marks}
                      onChange={e => handleQuestionChange(activeTab, 'marks', e.target.value)}
                    />
                  </div>
                </div>

                <label>Correct Answer</label>
                <input
                  value={quiz.questions[activeTab].correctAnswer}
                  onChange={e => handleQuestionChange(activeTab, 'correctAnswer', e.target.value)}
                />

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={quiz.questions[activeTab].requiresReview}
                    onChange={e => handleQuestionChange(activeTab, 'requiresReview', e.target.checked)}
                  />
                  Requires Manual Review
                </label>

                <h4>Answers</h4>
                <div className="answer-group">
                  {quiz.questions[activeTab].answers.map((a, aIdx) => (
                    <div key={aIdx} className="answer-block">
                      <input
                        placeholder="Answer Text"
                        value={a.text}
                        onChange={e => handleAnswerChange(activeTab, aIdx, 'text', e.target.value)}
                        required
                      />
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={a.correct}
                          onChange={e => handleAnswerChange(activeTab, aIdx, 'correct', e.target.checked)}
                        />
                        Correct
                      </label>
                      <input
                        placeholder="Explanation"
                        value={a.explanation}
                        onChange={e => handleAnswerChange(activeTab, aIdx, 'explanation', e.target.value)}
                      />
                      <button
                        type="button"
                        className="remove-answer"
                        onClick={() => removeAnswer(activeTab, aIdx)}
                      >
                        Remove Answer
                      </button>
                    </div>
                  ))}
                </div>

                <button type="button" className="btn" onClick={() => addAnswer(activeTab)}>+ Add Answer</button>
                <button type="button" className="btn btn-danger" onClick={() => removeQuestion(activeTab)}>
                  Remove This Question
                </button>
              </div>
            )}

            <button type="submit" className="submit-quiz-btn">
              {id ? 'Update Quiz' : 'Create Quiz'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateQuiz;
