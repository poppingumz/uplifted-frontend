import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Cookies from 'js-cookie';
import { fetchQuizById } from '../../services/api';
import '../../styles/quiz-page.css';

const QuizPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await fetchQuizById(id);
        setQuiz(data);
      } catch (e) {
        console.error("Failed to load quiz:", e);
      }
    };
    loadQuiz();
  }, [id]);

  const handleChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    let total = 0;
    let correct = 0;

    quiz.questions.forEach(q => {
      total += q.marks;
      const given = answers[q.id];
      const correctAnswer = q.answers?.find(a => a.correct);
      if (given && correctAnswer && given === correctAnswer.text) {
        correct += q.marks;
      }
    });

    const userCookie = Cookies.get('user');
    if (!userCookie) {
      alert('You must be logged in to submit.');
      return;
    }

    const user = JSON.parse(userCookie);
    const passedQuiz = correct >= quiz.passingMarks;

    try {
      // extract the JWT token you stored in the user cookie
      const { token } = JSON.parse(userCookie);

      await fetch('http://localhost:8080/api/quizzes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quizId: quiz.id,
          userId: user.id,
          score: correct,
          passed: passedQuiz
        })
      });
    } catch (err) {
      console.error('❌ Failed to submit quiz result:', err);
    }

    setScore(correct);
    setPassed(passedQuiz);
    setSubmitted(true);
  };

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <>
      <Navbar />
      <div className="quiz-container">
        <h1>{quiz.title}</h1>
        <p className="description">{quiz.description}</p>
        <p className="info">
          Total Marks: {quiz.totalMarks} | Passing: {quiz.passingMarks}
        </p>

        <form className="quiz-form" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          {quiz.questions.map((q, i) => (
            <div className="question-box" key={q.id}>
              <h3>{i + 1}. {q.text} ({q.marks} marks)</h3>

              {q.type === 'MULTIPLE_CHOICE' && q.answers.map((a, ai) => (
                <label key={ai} className="answer-option">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={a.text}
                    checked={answers[q.id] === a.text}
                    onChange={() => handleChange(q.id, a.text)}
                    disabled={submitted}
                  />
                  {a.text}
                </label>
              ))}

              {q.type === 'TRUE_FALSE' && ['True', 'False'].map((option, ai) => (
                <label key={ai} className="answer-option">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={option}
                    checked={answers[q.id] === option}
                    onChange={() => handleChange(q.id, option)}
                    disabled={submitted}
                  />
                  {option}
                </label>
              ))}

              {submitted && (
                <div className="feedback">
                  <strong>
                    {answers[q.id] === q.answers.find(a => a.correct)?.text
                      ? '✅ Correct'
                      : '❌ Incorrect'}
                  </strong>
                  {q.answers.find(a => a.explanation)?.explanation && (
                    <p className="explanation">
                      💡 Explanation: {q.answers.find(a => a.correct)?.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}

          {!submitted && (
            <button type="submit" className="submit-btn">
              Submit Quiz
            </button>
          )}
        </form>

        {submitted && (
          <div className="results-box">
            <h2>🎉 You {passed ? 'passed' : 'did not pass'}!</h2>
            <p>Your score: {score} / {quiz.totalMarks}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default QuizPage;
