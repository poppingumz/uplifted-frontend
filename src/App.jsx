import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Course/Courses';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AboutUs from './pages/AboutUs'; 
import Footer from './components/Footer';
import CreateCoursePage from './pages/Course/CreateCourse';
import Contact from './pages/Contact';
import CourseDetails from './pages/Course/CourseDetails';
import Account from './pages/Account';
import CreateQuizPage from './pages/Quiz/CreateQuiz'; 
import Unauthorized from './pages/Unauthorized'; 
import QuizPage from './pages/Quiz/QuizPage';
import WebSocketHandler from './components/WebSocketHandler';


function App() {
    return (
        <Router>
            <div className="app-container">
                <WebSocketHandler />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/aboutus" element={<AboutUs />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/createcourse" element={<CreateCoursePage />} />
                    <Route path="/createcourse/:id" element={<CreateCoursePage />} />
                    <Route path="/courses/:id" element={<CourseDetails />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/account/:id" element={<Account />} />
                    <Route path="/createquiz" element={<CreateQuizPage />} />
                    <Route path="/createquiz/:id" element={<CreateQuizPage />} />
                    <Route path="/quiz/:id" element={<QuizPage />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
