import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Illustration from '../assets/img/Illustration_main.jpg';


const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const cookieData = Cookies.get('user');
        if (cookieData) {
            setUser(JSON.parse(cookieData));
        }
    }, []);

    return (
        <>
            <Navbar />
            <div className="uplifted-home">
                <section className="hero">
                    <div className="hero-content">
                        <h1>
                            Welcome{user ? `, ${user?.user?.firstName || user?.user?.username}` : ''} to <span>UpliftEd</span>
                        </h1>
                        <p>Empowering learners and educators with the tools to succeed. Explore courses, teach others, and grow together.</p>
                        <div className="cta-buttons">
                            <button onClick={() => navigate('/courses')}>Explore Courses</button>
                            {!user && <button onClick={() => navigate('/register')}>Join Now</button>}
                        </div>
                    </div>
                    <div className="hero-image">
                         <img src={Illustration} alt="Learning Illustration" />
                    </div>
                </section>

                <section className="features">
                    <h2>Why Choose UpliftEd?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <img src="/assets/icon-courses.svg" alt="Courses" />
                            <h3>Diverse Courses</h3>
                            <p>From tech to arts, access a wide range of courses created by top educators.</p>
                        </div>
                        <div className="feature-card">
                            <img src="/assets/icon-community.svg" alt="Community" />
                            <h3>Active Community</h3>
                            <p>Engage with students and mentors from all around the globe.</p>
                        </div>
                        <div className="feature-card">
                            <img src="/assets/icon-growth.svg" alt="Growth" />
                            <h3>Personal Growth</h3>
                            <p>Track your progress and upskill at your own pace with interactive tools.</p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;
