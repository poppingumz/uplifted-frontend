import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
